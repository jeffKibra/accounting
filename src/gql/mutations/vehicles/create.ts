import { gql } from '@apollo/client';

const CREATE_VEHICLE = gql`
  mutation CreateVehicle($formData: VehicleInput!) {
    createVehicle(formData: $formData)
  }
`;

// const CREATE_VEHICLE = gql`
//   mutation CV($reg: String!) {
//     cv(reg: $reg)
//   }
// `;

export default CREATE_VEHICLE;
