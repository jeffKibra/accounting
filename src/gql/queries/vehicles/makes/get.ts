import { gql } from '@apollo/client';

export const vehicleMakeFields = `
   _id
    name
`;

const GET_VEHICLE_MAKE = gql`
  query GetVehicleMake($id: ID) {
    vehicleMake(id: $id) {
     ${vehicleMakeFields}
    }
  }
`;

export default GET_VEHICLE_MAKE;
