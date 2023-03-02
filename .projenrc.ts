import { TwinDigitalCdkApp } from '@twin-digital/projen'
import { CodeArtifactAuthProvider } from 'projen/lib/javascript'

const project = new TwinDigitalCdkApp({
  autoMergeOptions: {
    approvedReviews: 0,
  },
  codeArtifactOptions: {
    authProvider: CodeArtifactAuthProvider.GITHUB_OIDC,
    roleToAssume: 'arn:aws:iam::934979133063:role/CommonCicd-RootGitHubGithubActionsACC56793-79JE121HOPUG',
  },
  deps: ['@twin-digital/cdk-patterns'],
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  devDeps: ['@twin-digital/projen', 'cdk-pipelines-github'],
  name: 'iam-core-aws',
})

project.synth()
