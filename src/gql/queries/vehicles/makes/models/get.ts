import { gql } from '@apollo/client';

export const vehicleModelFields = `
   _id
    name
    make
    type
    years
    metaData {
      orgId
    }
`;

const GET_VEHICLE_MODEL = gql`
  query GetVehicleModel($makeId: ID!, $id: ID) {
    vehicleModel(makeId: $makeId, id: $id) {
     ${vehicleModelFields}
    }
  }
`;

export default GET_VEHICLE_MODEL;
