#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { AdieuAPIStack } from '../lib/adieu-stack'
import { AdieuWebStack } from '../lib/adieu-stack'
import { AdieuCloudfrontStack } from '../lib/adieu-stack'

const app = new cdk.App()
const api = new AdieuAPIStack(app, 'AdieuAPIStack', {})
const web = new AdieuWebStack(app, 'AdieuWebStack', {})
new AdieuCloudfrontStack(app, 'AdieuCloudFrontStack', {
  httpApi: api.httpApi,
  websiteBucket: web.websiteBucket,
  oai: web.oai,
})
