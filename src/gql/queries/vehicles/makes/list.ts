import { gql } from '@apollo/client';

import { vehicleMakeFields } from './get';

const LIST_VEHICLE_MAKES = gql`
  query ListVehicleMakes {
    vehicleMakes {
        ${vehicleMakeFields}
    }
  }
`;

export default LIST_VEHICLE_MAKES;
