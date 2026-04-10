export const LISTINGS_QUERY = `
  query Listings($pagination: CursorPaginationInput!, $filters: ListingFiltersInput) {
    listings(pagination: $pagination, filters: $filters) {
      edges {
        cursor
        node {
          id
          title
          description
          price
          beds
          baths
          propertyType
          suburb
          agentId
          createdAt
          agent {
            id
            name
            email
            phone
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const LISTING_DETAIL_QUERY = `
  query Listing($id: ID!) {
    listing(id: $id) {
      id
      title
      description
      price
      beds
      baths
      propertyType
      suburb
      agentId
      createdAt
      internalNotes
      agent {
        id
        name
        email
        phone
      }
    }
  }
`;
