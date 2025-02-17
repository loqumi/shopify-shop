const NEW_PRODUCT_FRAGMENT = `#graphql
  fragment NewProductVariant on ProductVariant {
    id
    availableForSale
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
  fragment NewProduct on Product {
    id
    title
    vendor
    handle
    variants(first: 1) {
      nodes {
        ...NewProductVariant
      }
    }
    seo {
      description
      title
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
  }
` as const;

// query: "tag:new" after reverse – possible option
// adds all recently added products
export const NEW_PRODUCTS_QUERY = `#graphql
  query NewProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
  ) @inContext(country: $country, language: $language) {
    products(first: $first, sortKey: CREATED_AT, reverse: true, query: "NOT product_type:'gift card'") {
      nodes {
        ...NewProduct
      }
    }
  }
  ${NEW_PRODUCT_FRAGMENT}
` as const;
