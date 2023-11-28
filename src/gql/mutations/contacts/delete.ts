import { gql } from '@apollo/client';

//
// import { vehicleInListFields } from '../../queries/vehicles/searchVehicles';

const DELETE_CONTACT = gql`
  mutation DeleteContact($id: ID!) {
    deleteContact(id: $id)
  }
`;

export default DELETE_CONTACT;
