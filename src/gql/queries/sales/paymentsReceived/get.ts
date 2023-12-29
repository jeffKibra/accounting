import { gql } from '@apollo/client';

export const paymentReceivedFields = `
  _id
  paymentDate
  customer {
    _id
    displayName
  }
  amount
  reference
  allocations {
    invoiceId
    amount
    transactionType
  }
  paymentMode{
    _id
    name
  } 
  excess
  
  metaData {
    createdAt
  }
`;

// payments{
//     paymentId
//     amount
//   }

const GET_PAYMENT_RECEIVED = gql`
  query GetPaymentReceived($id: ID) {
    paymentReceived(id: $id) {
     ${paymentReceivedFields}
    }
  }
`;

export default GET_PAYMENT_RECEIVED;
