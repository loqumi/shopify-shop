// NOTE: https://shopify.dev/docs/api/customer/latest/objects/Customer
export const CUSTOMER_FRAGMENT = `#graphql
  fragment Customer on Customer {
    id
    firstName
    lastName
    imageUrl
    emailAddress {
      emailAddress
    }
    phoneNumber {
        phoneNumber
    }
    metafields(
      identifiers: [
        { namespace: "facts", key: "birth_date" },
        { namespace: "facts", key: "city" },
        { namespace: "facts", key: "phone" },
        { namespace: "card", key: "bonus_points" }
        { namespace: "card", key: "discount" }
      ]
    ) {
      key
      value
    }
    # metafield(namespace: "facts", key: "birth_date") {
    #   value
    #   type
    # }
    defaultAddress {
      ...Address
    }
    addresses(first: 6) {
      nodes {
        ...Address
      }
    }
  }
  fragment Address on CustomerAddress {
    id
    formatted
    firstName
    lastName
    company
    address1
    address2
    territoryCode
    zoneCode
    city
    zip
    phoneNumber
  }
` as const;

// NOTE: https://shopify.dev/docs/api/customer/latest/queries/customer
export const CUSTOMER_DETAILS_QUERY = `#graphql
  query CustomerDetails {
    customer {
      ...Customer
    }
  }
  ${CUSTOMER_FRAGMENT}
` as const;
