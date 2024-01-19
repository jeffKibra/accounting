import { gql } from '@apollo/client';
//
import { vehicleModelFields } from './models/get';

//

export const vehicleMakeFields = `
   _id
    name
`;

export const vehicleMakeWithModelsFields = `
  ${vehicleMakeFields}
  models {
    ${vehicleModelFields}
  }
`;

const GET_VEHICLE_MAKE = gql`
  query GetVehicleMake($name: String!) {
    vehicleMake(name: $name) {
     ${vehicleMakeWithModelsFields}
    }
  }
`;

export default GET_VEHICLE_MAKE;
