import { gql } from '@apollo/client';
//
import { bookingFields } from '../../../queries/sales/bookings/get';

const UPDATE_BOOKING = gql`
  mutation UpdateBooking($id: ID!, $formData: BookingInput!) {
    updateBooking(id: $id, formData: $formData) {
      ${bookingFields}
    }
  }
`;

export default UPDATE_BOOKING;
