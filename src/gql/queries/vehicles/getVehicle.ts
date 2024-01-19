import { gql } from '@apollo/client';

export const vehicleFields = `
   _id
  registration
  rate
  model {
    name
    make
    type
    year
  }
  color
  description
`;

const GET_VEHICLE = gql`
  query GetVehicle($id: ID) {
    vehicle(id: $id) {
     ${vehicleFields}
    }
  }
`;

export default GET_VEHICLE;
