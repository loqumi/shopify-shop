import {gql} from 'graphql-request';

export const PRODUCTS_QUERY = gql`
  query getProductCategories($handle: String!) {
    productByHandle(handle: $handle) {
      category {
        fullName
      }
    }
  }
`;
