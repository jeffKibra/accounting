import { gql } from '@apollo/client';
//
import { vehicleMakeFields } from '../../../../queries/vehicles/makes/get';

const UPDATE_VEHICLE_MODEL = gql`
  mutation UpdateVehicleModel($id: ID!, $formData: VehicleModelInput!) {
    updateVehicleModel(id:$id, formData: $formData) {
      ${vehicleMakeFields}
    }
  }
`;

export default UPDATE_VEHICLE_MODEL;
