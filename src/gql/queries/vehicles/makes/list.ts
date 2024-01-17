import { gql } from '@apollo/client';

import { vehicleMakeFields } from './get';

const LIST_VEHICLE_MAKES = gql`
  query ListVehicleMakes {
    listVehicleMakes {
        ${vehicleMakeFields}
    }
  }
`;

export default LIST_VEHICLE_MAKES;
