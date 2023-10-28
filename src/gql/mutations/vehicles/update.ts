import { gql } from '@apollo/client';
//
import { vehicleFields } from '../../queries/vehicles/getVehicle';

const UPDATE_VEHICLE = gql`
  mutation UpdateVehicle($id: ID!, $formData: VehicleInput!) {
    updateVehicle(id: $id, formData: $formData) {
      ${vehicleFields}
    }
  }
`;

export default UPDATE_VEHICLE;
