import { gql } from '@apollo/client';

//
// import { vehicleInListFields } from '../../queries/vehicles/searchVehicles';

const DELETE_VEHICLE = gql`
  mutation DeleteVehicle($id: ID!) {
    deleteVehicle(id: $id)
  }
`;

export default DELETE_VEHICLE;
