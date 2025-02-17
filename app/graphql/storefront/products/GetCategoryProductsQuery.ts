export const GET_CATEGORY_PRODUCTS = `#graphql
  fragment CategoryProductVariant on ProductVariant {
    title
    id
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    image {
      altText
      url
      id
      height
      width
      __typename
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
  }
  fragment CategoryProduct on Product {
    id
    title
    vendor
    handle
    productType
    description
    images(first: 1) {
      edges {
        node {
          id
          url
          __typename
        }
      }
    }
    options {
      name
      values
    }
    seo {
      description
      title
    }
    variants(first: 1) {
      nodes {
        ...CategoryProductVariant
      }
    }
  }
  query GetCategoryProducts(
      $categoryName: String! 
      $first: Int
      $last: Int
      $startCursor: String
      $endCursor: String
    ) {
      products(query: $categoryName, first: $first, last: $last, before: $startCursor, after: $endCursor) {
        edges {
          node {
            ...CategoryProduct
          }
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          startCursor
          endCursor
        }
      }
    }
`;
