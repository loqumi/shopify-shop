export const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment HistoryProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
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
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment HistoryProduct on Product {
    id
    title
    vendor
    handle
    productType
    publishedAt
    descriptionHtml
    description
    images(first: 1) {
      edges {
        node {
          id
          url
        }
      }
    }
    options {
      name
      values
    }
    variants(first: 1) {
      nodes {
        ...HistoryProductVariant
      }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

export const GET_HISTORY_PRODUCTS = `#graphql
  query GetProducts($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        ...HistoryProduct
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;
