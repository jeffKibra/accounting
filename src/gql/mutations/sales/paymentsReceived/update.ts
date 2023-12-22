import { gql } from '@apollo/client';
//
import { paymentReceivedFields } from '../../../queries/sales/paymentsReceived/get';

const UPDATE_PAYMENT_RECEIVED = gql`
  mutation UpdatePaymentReceived($id: ID!, $formData: PaymentReceivedInput!) {
    updatePaymentReceived(id: $id, formData: $formData) {
      ${paymentReceivedFields}
    }
  }
`;

export default UPDATE_PAYMENT_RECEIVED;
