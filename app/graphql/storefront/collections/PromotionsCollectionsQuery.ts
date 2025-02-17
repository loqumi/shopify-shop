export const PROMOTIONS_COLLECTIONS_QUERY = `#graphql
  fragment PromotionsCollection on Collection {
    id
    title
    handle
    description
    image {
      url
    }
  }
  query PromotionsCollections {
    collections(first: 4, query: "title:promotions*") {
      nodes {
        ...PromotionsCollection
      }
    }
  }
` as const;
