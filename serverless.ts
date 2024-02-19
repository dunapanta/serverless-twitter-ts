import type { AWS } from '@serverless/typescript';

import CognitoResources from './serverless/cognitoResources';

const serverlessConfiguration: AWS = {
  service: 'serverless-twitter-ts',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-appsync-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'us-east-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import the function via paths
  //functions: { hello },
  resources: {
    Resources: {
      ...CognitoResources,
    },
    Outputs: {
      CognitoUserPoolId: {
        Value: { Ref: 'CognitoUserPool' },
      }, 
    },
  },
  package: { individually: true },
  custom: {
    appSync: {
      name: 'serverless-twitter-ts',
      schema: 'schema.api.graphql',
      authenticationType: 'AMAZON_COGNITO_USER_POOLS',
      userPoolsConfig: {
        awsRegion: 'us-east-1',
        defaultAction: 'ALLOW',
        userPoolId: { Ref: 'CognitoUserPool' },
      }
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
