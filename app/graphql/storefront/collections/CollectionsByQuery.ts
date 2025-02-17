export const COLLECTIONS_BY_QUERY = `#graphql
  fragment CollectionByQuery on Collection {
    id
    title
    handle
    description
    image {
      altText
      url
      __typename
    }
    metafield (key: "header", namespace: "collection") {
      value
    }
  }
  query CollectionsByQuery(
      $query: String! 
      $first: Int
      $last: Int
      $startCursor: String
      $endCursor: String
    ) {
    collections(query: $query, first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...CollectionByQuery
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
` as const;
