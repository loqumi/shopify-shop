import {type CodegenConfig} from '@graphql-codegen/cli';
import 'dotenv/config';

const config: CodegenConfig = {
  schema: {
    [`https://${process.env.PUBLIC_STORE_DOMAIN}/admin/api/${process.env.SHOPIFY_GRAPHQL_VERSION}/graphql.json`]:
      {
        headers: {
          'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
        },
      },
  },
  documents: './app/graphql/admin-api/**/*.{ts,tsx}',
  generates: {
    './app/graphql/admin-api/types.ts': {
      plugins: ['typescript', 'typescript-operations'],
    },
    './app/graphql/admin-api/schema.graphql': {
      plugins: ['schema-ast'],
    },
  },
};

export default config;
