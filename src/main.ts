import { Bucket, getQualifiedName, Stack, StackProps, Stage, StageProps } from '@twin-digital/cdk-patterns'
import * as cdk from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'
import { StackCapabilities } from 'cdk-pipelines-github'
import { Construct } from 'constructs'

import { CdkPipeline } from './cdk-pipeline'

export type SeafileProps = StackProps

export class SeafileStorageStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, {
      ...props,
      workload: 'seafile',
    })

    const bucket = new Bucket(this, 'Bucket', {
      bucketName: getQualifiedName(this, 'data'),
    }).bucket

    new iam.Role(this, 'Role', {
      assumedBy: new iam.AccountPrincipal(''),
      description: 'Role assumed by the seafile user for accessing the S3 data bucket',
      inlinePolicies: {
        DataBucketAccess: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              actions: ['s3:GetObject', 's3:DeleteObject', 's3:PutObject'],
              effect: iam.Effect.ALLOW,
              resources: [`${bucket.bucketArn}/*`],
              sid: 'ObjectReadWrite',
            }),
            new iam.PolicyStatement({
              actions: ['s3:GetBucketLocation', 's3:ListBucket'],
              effect: iam.Effect.ALLOW,
              resources: [`${bucket.bucketArn}`],
              sid: 'BasicBucketAccess',
            }),
          ],
        }),
      },
      roleName: getQualifiedName(this, 'data-rw'),
    })
  }
}

export class SeafileStorageStage extends Stage {
  constructor(scope: Construct, id: string, props: StageProps) {
    super(scope, id, props)

    new SeafileStorageStack(this, 'SeafileStorage', {})
  }
}

const app = new cdk.App()

const pipeline = new CdkPipeline(app)

pipeline.addStageWithGitHubOptions(
  new SeafileStorageStage(app, 'Dev', {
    env: {
      account: '162712779706',
      region: 'us-east-2',
    },
    environmentType: 'dev',
  }),
  {
    stackCapabilities: [StackCapabilities.IAM, StackCapabilities.NAMED_IAM],
  }
)

app.synth()
