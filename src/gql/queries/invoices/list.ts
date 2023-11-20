import { gql } from '@apollo/client';

import { invoiceFields } from './get';

export const bookingInListFields = `
  ${invoiceFields}
`;

const LIST_INVOICES = gql`
  query ListInvoices($options: InvoicesQueryOptions) {
    invoices(options: $options) {
      list {
        ${bookingInListFields}
      }
      meta {
        count
        page
      }
    }
  }
`;

export default LIST_INVOICES;
