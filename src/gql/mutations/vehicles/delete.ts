import { gql } from '@apollo/client';

const DELETE_VEHICLE = gql`
  mutation deleteVehicle($id: ID!) {
    deleteVehicle(id: $id)
  }
`;

export default DELETE_VEHICLE;
