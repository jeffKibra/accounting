import { gql } from '@apollo/client';

const CREATE_BOOKING = gql`
  mutation CreateBooking($formData: BookingInput!) {
    createBooking(formData: $formData)
  }
`;


export default CREATE_BOOKING;
