import { gql } from '@apollo/client';

const CREATE_PAYMENT_RECEIVED = gql`
  mutation CreatePaymentReceived($formData: PaymentReceivedInput!) {
    createPaymentReceived(formData: $formData)
  }
`;

export default CREATE_PAYMENT_RECEIVED;
