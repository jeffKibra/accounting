import { gql } from '@apollo/client';

const CREATE_BOOKING = gql`
  mutation CreateBooking($formData: BookingAndDownPaymentInput!) {
    createBooking(formData: $formData)
  }
`;

export default CREATE_BOOKING;
