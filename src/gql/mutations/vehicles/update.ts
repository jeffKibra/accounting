import { gql } from '@apollo/client';

const UPDATE_VEHICLE = gql`
  mutation updateVehicles($id: ID!, $formData: VehiclesInput!) {
    updateVehicle(id: $id, formData: $formData) {
      _id
    }
  }
`;

export default UPDATE_VEHICLE;
