import { gql } from '@apollo/client';

export const bookingFields = `
  _id
  vehicle {
     _id
    registration
    model {
      make
      model
    } 
    year 
  }
  customer {
    _id
    displayName
  }
  bookingRate
  bookingTotal
  transferFee
  selectedDates
  startDate
  endDate
  subTotal
  total
  downPayment {
    amount
    paymentMode {
      name
      _id
    }
  }
  balance
`;

const GET_BOOKING = gql`
  query GetBooking($id: ID) {
    booking(id: $id) {
     ${bookingFields}
    }
  }
`;

export default GET_BOOKING;
