import { gql } from '@apollo/client';

export const vehicleModelFields = `
   _id
    name
    make
    type
    years
    metaData {
      orgId
      createdAt
    }
`;

const GET_VEHICLE_MODEL = gql`
  query GetVehicleModel($make: String!, $id: ID!) {
    vehicleModel(make: $make, id: $id) {
     ${vehicleModelFields}
    }
  }
`;

export default GET_VEHICLE_MODEL;
