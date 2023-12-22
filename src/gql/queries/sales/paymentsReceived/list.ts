import { gql } from '@apollo/client';

import { paymentReceivedFields } from './get';

export const paymentReceivedInListFields = `
  ${paymentReceivedFields}
`;

const LIST_PAYMENTS_RECEIVED = gql`
  query ListpaymentReceiveds($queryOptions: PaymentsReceivedQueryOptions) {
    paymentsReceived(options: $queryOptions) {
      list {
        ${paymentReceivedInListFields}
      }
      meta {
        count
        page
      }
    }
  }
`;

export default LIST_PAYMENTS_RECEIVED;
