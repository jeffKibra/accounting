import { gql } from '@apollo/client';

// const plus = gql`
//   input Pagination {
//     currentPage: Int
//     limit: Int
//     after: PaginationCursor
//     before: PaginationCursor
//   }
//   input VehicleFilters {
//     make: [String]
//     model: [String]
//     type: [String]
//     color: [String]
//     rate: [Int]
//   }
//   type VehiclesQueryOptions {
//     pagination: Pagination
//     selectedDates: [String]
//     filters: VehicleFilters
//   }
// `;
const SEARCH_VEHICLES = gql`
  query searchVehicles($query: ID, $queryOptions: VehiclesQueryOptions) {
    searchVehicles(query: $query, queryOptions: $queryOptions) {
      vehicles {
        _id
        searchScore
        registration
        rate
        make
        model
        type
        year
        color
        metaData {
          status
        }
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

export default SEARCH_VEHICLES;
