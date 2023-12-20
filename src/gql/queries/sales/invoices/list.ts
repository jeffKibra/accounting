import { gql } from '@apollo/client';

import { invoiceFields } from './get';

export const invoiceInListFields = `
  ${invoiceFields}
`;

const LIST_INVOICES = gql`
  query ListInvoices($queryOptions: InvoicesQueryOptions) {
    invoices(options: $queryOptions) {
      list {
        ${invoiceInListFields}
      }
      meta {
        count
        page
      }
    }
  }
`;

export default LIST_INVOICES;
