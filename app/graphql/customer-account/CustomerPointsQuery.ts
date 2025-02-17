export const CUSTOMER_POINTS_QUERY = `#graphql
  fragment CustomerPoints on Customer {
    metafields(
      identifiers: [
        { namespace: "card", key: "bonus_points" }
        { namespace: "card", key: "discount" }
      ]
    ) {
      key
      value
    }
  }

  query CustomerPoints {
    customer {
      ...CustomerPoints
    }
  }
` as const;
