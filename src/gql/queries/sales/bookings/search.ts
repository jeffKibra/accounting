import { gql } from '@apollo/client';

import { bookingFields } from './get';

export const bookingInListFields = `
  ${bookingFields}
`;

const SEARCH_BOOKINGS = gql`
  query SearchBookings($query: ID, $queryOptions: BookingsQueryOptions) {
    searchBookings(query: $query, queryOptions: $queryOptions) {
      bookings {
        ${bookingInListFields}
        searchScore
      }
      meta {
        count
        page
        facets {
          makes {
            _id
            count
            models {
              _id
              count
            }
          }
          ratesRange {
            min
            max
          }
          types {
            _id
            count
          }
          colors {
            _id
            count
          }
        }
      }
    }
  }
`;

export default SEARCH_BOOKINGS;
