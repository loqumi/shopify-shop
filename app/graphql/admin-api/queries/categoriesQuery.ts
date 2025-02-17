export const CATEGORIES_QUERY = `#graphql
  query GetProductCategories {
    shop {
      allProductCategoriesList {
        name
        id
        fullName
      }
    }
  }
`;
