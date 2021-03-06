import { Duration, RemovalPolicy } from '@aws-cdk/core'
import { LambdaProxyIntegration } from '@aws-cdk/aws-apigatewayv2-integrations'
import * as apigw from '@aws-cdk/aws-apigatewayv2'
import * as cdk from '@aws-cdk/core'
import * as cloudfront from '@aws-cdk/aws-cloudfront'
import * as cm from '@aws-cdk/aws-certificatemanager'
import * as lambda from '@aws-cdk/aws-lambda'
import * as iam from '@aws-cdk/aws-iam'
import * as s3 from '@aws-cdk/aws-s3'
import * as s3deploy from '@aws-cdk/aws-s3-deployment'
import * as dynamodb from '@aws-cdk/aws-dynamodb'
import { StringParameter } from '@aws-cdk/aws-ssm'

export class AdieuAPIStack extends cdk.Stack {
  public readonly httpApi: apigw.HttpApi

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // Grab secrets from SSM, to pass to Lambdas
    const clientId = StringParameter.valueForStringParameter(
      this,
      '/adieu/client-id'
    )
    const clientSecret = StringParameter.valueForStringParameter(
      this,
      '/adieu/client-secret'
    )
    const clientRedirect = StringParameter.valueForStringParameter(
      this,
      '/adieu/client-redirect-url'
    )
    const homepage = StringParameter.valueForStringParameter(this, '/adieu/url')

    const table = new dynamodb.Table(this, 'Sessions', {
      partitionKey: { name: 'sessionId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    })

    const loginHandler = new lambda.Function(this, 'LoginHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('../back/build/login'),
      handler: 'index.loginHandler',
      timeout: Duration.seconds(30),
      environment: {
        CLIENT_ID: clientId,
        CLIENT_SECRET: clientSecret,
        CLIENT_REDIRECT: clientRedirect,
        SESSIONS_TABLE_NAME: table.tableName,
      },
    })
    table.grantReadWriteData(loginHandler)

    const loginCallbackHandler = new lambda.Function(this, 'CallbackHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('../back/build/login'),
      handler: 'index.callbackHandler',
      timeout: Duration.seconds(30),
      environment: {
        CLIENT_ID: clientId,
        CLIENT_SECRET: clientSecret,
        CLIENT_REDIRECT: clientRedirect,
        ADIEU_HOMEPAGE: homepage,
        SESSIONS_TABLE_NAME: table.tableName,
      },
    })
    table.grantReadWriteData(loginCallbackHandler)

    const emailsHandler = new lambda.Function(this, 'EmailsHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('../back/build/emails'),
      handler: 'index.emailsHandler',
      timeout: Duration.seconds(30),
      memorySize: 512,
      environment: {
        CLIENT_ID: clientId,
        CLIENT_SECRET: clientSecret,
        CLIENT_REDIRECT: clientRedirect,
        SESSIONS_TABLE_NAME: table.tableName,
      },
    })
    table.grantReadWriteData(emailsHandler)

    const emailHandler = new lambda.Function(this, 'EmailHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('../back/build/emails'),
      handler: 'index.emailHandler',
      timeout: Duration.seconds(30),
      memorySize: 512,
      environment: {
        CLIENT_ID: clientId,
        CLIENT_SECRET: clientSecret,
        CLIENT_REDIRECT: clientRedirect,
        SESSIONS_TABLE_NAME: table.tableName,
      },
    })
    table.grantReadWriteData(emailHandler)

    const attachmentsBucket = new s3.Bucket(this, 'AttachmentsBucket', {
      lifecycleRules: [
        {
          expiration: Duration.days(30),
        },
      ],
    })
    const viewAttachmentHandler = new lambda.Function(
      this,
      'AttachmentViewHandler',
      {
        runtime: lambda.Runtime.NODEJS_12_X,
        code: lambda.Code.fromAsset('../back/build/emails'),
        handler: 'index.attachmentViewHandler',
        timeout: Duration.seconds(30),
        memorySize: 512,
        environment: {
          CLIENT_ID: clientId,
          CLIENT_SECRET: clientSecret,
          CLIENT_REDIRECT: clientRedirect,
          SESSIONS_TABLE_NAME: table.tableName,
          ATTACHMENTS_BUCKET_NAME: attachmentsBucket.bucketName,
        },
      }
    )
    table.grantReadWriteData(viewAttachmentHandler)
    attachmentsBucket.grantReadWrite(viewAttachmentHandler)

    this.httpApi = new apigw.HttpApi(this, 'ApiGateway')
    this.httpApi.addRoutes({
      path: '/api/emails',
      methods: [apigw.HttpMethod.GET],
      integration: new LambdaProxyIntegration({
        handler: emailsHandler,
      }),
    })
    this.httpApi.addRoutes({
      path: '/api/email/{emailId}',
      methods: [apigw.HttpMethod.GET],
      integration: new LambdaProxyIntegration({
        handler: emailHandler,
      }),
    })
    this.httpApi.addRoutes({
      path: '/api/email/{emailId}/attachment/{attachmentId}',
      methods: [apigw.HttpMethod.GET],
      integration: new LambdaProxyIntegration({
        handler: viewAttachmentHandler,
      }),
    })

    this.httpApi.addRoutes({
      path: '/api/login',
      methods: [apigw.HttpMethod.GET],
      integration: new LambdaProxyIntegration({
        handler: loginHandler,
      }),
    })

    this.httpApi.addRoutes({
      path: '/api/callback',
      methods: [apigw.HttpMethod.GET],
      integration: new LambdaProxyIntegration({
        handler: loginCallbackHandler,
      }),
    })
  }
}

export class AdieuWebStack extends cdk.Stack {
  public readonly websiteBucket: s3.Bucket
  public readonly oai: cloudfront.OriginAccessIdentity

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    this.websiteBucket = new s3.Bucket(this, 'StaticAssetsBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
    })

    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset(`../front/build`)],
      destinationBucket: this.websiteBucket,
    })

    this.oai = new cloudfront.OriginAccessIdentity(this, 'CloudFrontOAI', {
      comment: `CF to S3`,
    })
  }
}

export interface AdieuStackProps extends cdk.StackProps {
  websiteBucket: s3.IBucket
  httpApi: apigw.IHttpApi
  oai: cloudfront.IOriginAccessIdentity
}

export class AdieuCloudfrontStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: AdieuStackProps) {
    super(scope, id, props)

    const cert = cm.Certificate.fromCertificateArn(
      this,
      'Cert',
      'arn:aws:acm:us-east-1:140551133576:certificate/3e69d173-9c42-446f-960b-faa90c4667dc'
    )

    props.websiteBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        sid: 'Grant Cloudfront Origin Access Identity access to S3 bucket',
        actions: ['s3:GetObject'],
        resources: [props.websiteBucket.bucketArn + '/*'],
        principals: [props.oai.grantPrincipal],
      })
    )

    new cloudfront.CloudFrontWebDistribution(this, 'Distribution', {
      comment: 'Adieu',
      defaultRootObject: 'index.html',
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      viewerCertificate: {
        aliases: ['adieu.joejag.com'],
        props: {
          acmCertificateArn: cert.certificateArn,
          sslSupportMethod: 'sni-only',
        },
      },
      originConfigs: [
        {
          customOriginSource: {
            domainName: `${props.httpApi.httpApiId}.execute-api.${this.region}.amazonaws.com`,
          },
          behaviors: [
            {
              pathPattern: '/api/*',
              allowedMethods: cloudfront.CloudFrontAllowedMethods.ALL,
              defaultTtl: Duration.seconds(0),

              forwardedValues: {
                cookies: {
                  forward: 'all',
                },
                queryString: true,
                headers: ['Authorization'],
              },
            },
          ],
        },
        {
          s3OriginSource: {
            s3BucketSource: props.websiteBucket,
            originAccessIdentity: props.oai,
          },
          behaviors: [
            {
              compress: true,
              isDefaultBehavior: true,
              defaultTtl: Duration.seconds(0),
              allowedMethods:
                cloudfront.CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
            },
          ],
        },
      ],
      errorConfigurations: [
        {
          errorCode: 403,
          responseCode: 200,
          responsePagePath: '/index.html',
        },
      ],
    })
  }
}
