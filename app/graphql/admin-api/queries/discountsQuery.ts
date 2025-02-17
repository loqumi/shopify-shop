import {gql} from 'graphql-request';

export const DISCOUNTS_QUERY = gql`
  query getAutomaticDiscounts {
    automaticDiscountNodes(first: 10) {
      nodes {
        automaticDiscount {
          ... on DiscountAutomaticBxgy {
            __typename
            summary
            id
            customerBuys {
              items {
                ... on DiscountProducts {
                  __typename
                  products(first: 10) {
                    nodes {
                      variants(first: 1) {
                        nodes {
                          id
                        }
                      }
                    }
                  }
                }
              }
              value {
                ... on DiscountPurchaseAmount {
                  __typename
                  amount
                }
                ... on DiscountQuantity {
                  __typename
                  quantity
                }
              }
            }
            customerGets {
              items {
                ... on DiscountProducts {
                  __typename
                  products(first: 10) {
                    nodes {
                      id
                      handle
                      images(first: 1) {
                        nodes {
                          height
                          width
                          url
                        }
                      }
                      productType
                      title
                      vendor
                      variants(first: 1) {
                        nodes {
                          availableForSale
                          compareAtPrice
                          id
                          image {
                            altText
                            height
                            id
                            url
                            width
                          }
                          price
                          product {
                            title
                            handle
                            compareAtPriceRange {
                              maxVariantCompareAtPrice {
                                currencyCode
                              }
                            }
                          }
                          selectedOptions {
                            name
                            value
                          }
                          sku
                          title
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
