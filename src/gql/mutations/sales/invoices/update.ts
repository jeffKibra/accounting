import { gql } from '@apollo/client';
//
import { invoiceFields } from '../../../queries/sales/invoices/get';

const UPDATE_BOOKING = gql`
  mutation UpdateBooking($id: ID!, $formData: BookingInput!) {
    updateBooking(id: $id, formData: $formData) {
      ${invoiceFields}
    }
  }
`;

export default UPDATE_BOOKING;
