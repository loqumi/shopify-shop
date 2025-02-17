export const STORIES_COLLECTIONS_QUERY = `#graphql
  fragment StoriesCollection on Collection {
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
  query StoriesCollections {
    collections(first: 10, query: "title:stories*") {
      nodes {
        ...StoriesCollection
      }
    }
  }
` as const;
