import { gql } from '@apollo/client';

import { vehicleFields } from './getVehicle';

export const vehicleInListFields = `
  ${vehicleFields}
`;

const SEARCH_VEHICLES = gql`
  query SearchVehicles($query: ID, $queryOptions: VehiclesQueryOptions) {
    searchVehicles(query: $query, queryOptions: $queryOptions) {
      list {
        ${vehicleInListFields}
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

export default SEARCH_VEHICLES;
