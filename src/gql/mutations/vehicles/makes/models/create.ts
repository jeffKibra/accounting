import { gql } from '@apollo/client';

const CREATE_VEHICLE_MODEL = gql`
  mutation CreateVehicleModel($formData: VehicleModelInput!) {
    createVehicleModel(formData: $formData)
  }
`;

// const CREATE_VEHICLE_MODEL = gql`
//   mutation CV($reg: String!) {
//     cv(reg: $reg)
//   }
// `;

export default CREATE_VEHICLE_MODEL;
