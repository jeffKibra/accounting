import { gql } from '@apollo/client';
//
import { invoiceFields } from '../invoices/get';
//

export const allocationFields = `
  invoiceId
  amount
  transactionType
`;

export const paymentReceivedFields = `
  _id
  paymentDate
  customer {
    _id
    displayName
  }
  amount
  reference
  
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

export const GET_PAYMENT_RECEIVED = gql`
  query GetPaymentReceived($id: ID) {
    paymentReceived(id: $id) {
     ${paymentReceivedFields}
     allocations {
       ${allocationFields}
     }
    }
  }
`;

export const GET_PAYMENT_RECEIVED_WITH_INVOICES_POPULATED = gql`
  query GetPaymentReceivedWithPopulatedInvoices($id: ID) {
    populatedPaymentReceived(id: $id) {
     ${paymentReceivedFields}
     allocations {
        ${invoiceFields}
       ${allocationFields}
     }
    }
  }
`;
