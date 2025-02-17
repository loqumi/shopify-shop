const COLLECTION_PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment CollectionProductItem on Product {
    id
    handle
    title
    vendor
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 1) {
      nodes {
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
    }
  }
` as const;

export const COLLECTION_QUERY = `#graphql
  ${COLLECTION_PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      metafield (key: "header", namespace: "collection") {
        value
      }
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...CollectionProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;
