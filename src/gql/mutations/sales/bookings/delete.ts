import { gql } from '@apollo/client';

//
// import { vehicleInListFields } from '../../queries/vehicles/searchVehicles';

const DELETE_BOOKING = gql`
  mutation DeleteBooking($id: ID!) {
    deleteBooking(id: $id)
  }
`;

export default DELETE_BOOKING;
