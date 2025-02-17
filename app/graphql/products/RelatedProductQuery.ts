export const RELATED_PRODUCT_QUERY = `#graphql
  query RelatedProduct(
    $productId: ID!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(id: $productId) {
      id
      title
      description
      handle
      images(first: 1) {
        edges {
          node {
            url
            altText
          }
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 1) {
        nodes {
          id
          title
          sku
          availableForSale
          compareAtPrice {
            amount
            currencyCode
          }
          image {
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
          unitPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
` as const;
