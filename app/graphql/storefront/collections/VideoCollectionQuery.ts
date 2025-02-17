export const VIDEO_COLLECTION_QUERY = `#graphql
  fragment VideoCollectionProduct on Product {
    id
    title
    vendor
    handle
    productType
    publishedAt
    description
    descriptionHtml
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
        availableForSale
        id
        sku
        title
        compareAtPrice {
          amount
          currencyCode
        }
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
        unitPrice {
          amount
          currencyCode
        }
      }
    }
    seo {
      description
      title
    }
  }
  fragment VideoCollection on Collection {
    description
    products (first: 10) {
      nodes{
        ...VideoCollectionProduct
      }
    }
  }
  query VideoCollection {
    collection(handle: "video-collection") {
      ...VideoCollection
    }
  }
` as const;
