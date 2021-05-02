import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import * as Infra from '../lib/adieu-stack'

test('Empty Stack', () => {
  const app = new cdk.App()

  const stack = new Infra.AdieuWebStack(app, 'MyTestStack')

  expectCDK(stack).to(
    matchTemplate(
      {
        Resources: {},
      },
      MatchStyle.EXACT
    )
  )
})
