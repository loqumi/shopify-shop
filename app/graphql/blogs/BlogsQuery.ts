const ARTICLE_FRAGMENT = `#graphql 
  fragment ArticleFragment on Article {
    author: authorV2 {
      name
    }
    contentHtml
    handle
    id
    image {
      id
      altText
      url
      width
      height
    }
    publishedAt
    title
    blog {
      handle
    }
  }
` as const;

export const BLOGS_QUERY = `#graphql
  query Blogs(
    $language: LanguageCode
    $first: Int
  ) @inContext(language: $language) {
    blogs(first: 3) {
      nodes {
        title
        handle
        seo {
          title
          description
        }
        articles(
          first: $first
          sortKey: PUBLISHED_AT
          reverse: true
        ) {
          nodes {
            ...ArticleFragment
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
  }
  ${ARTICLE_FRAGMENT}
` as const;
