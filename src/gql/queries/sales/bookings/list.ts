import { gql } from '@apollo/client';

import { bookingFields } from './get';

export const bookingInListFields = `
  ${bookingFields}
`;

const LIST_BOOKINGS = gql`
  query ListBookings {
    bookings {
        ${bookingInListFields}
    }
  }
`;

export default LIST_BOOKINGS;
