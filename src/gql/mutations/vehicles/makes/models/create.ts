import { gql } from '@apollo/client';

const CREATE_VEHICLE_MODEL = gql`
  mutation CreateVehicleModel($makeId: ID!, $formData: VehicleModelInput!) {
    createVehicleModel(makeId: $makeId, formData: $formData)
  }
`;

// const CREATE_VEHICLE_MODEL = gql`
//   mutation CV($reg: String!) {
//     cv(reg: $reg)
//   }
// `;

export default CREATE_VEHICLE_MODEL;
