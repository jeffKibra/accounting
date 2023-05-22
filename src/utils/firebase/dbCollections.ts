import { createCollection } from '.';

import {
  IContactFromDb,
  ExpenseFromDb,
  InvoiceFromDb,
  ItemFromDb,
  EntryFromDb,
  PaymentReceivedFromDb,
  SalesReceiptFromDb,
  TaxFromDb,
} from '../../types';

export default function dbCollections(orgId: string) {
  const org = `organizations/${orgId}`;
  return {
    contacts: createCollection<IContactFromDb>(`${org}/contacts`),
    expenses: createCollection<ExpenseFromDb>(`${org}/expenses`),
    invoices: createCollection<InvoiceFromDb>(`${org}/invoices`),
    items: createCollection<ItemFromDb>(`${org}/items`),
    entries: createCollection<EntryFromDb>(`${org}/journals`),
    paymentsReceived: createCollection<PaymentReceivedFromDb>(
      `${org}/payments`
    ),
    salesReceipts: createCollection<SalesReceiptFromDb>(`${org}/saleReceipts`),
    taxes: createCollection<TaxFromDb>(`${org}/taxes`),
    //     customers: createCollection<Customer>(`${org}/customers`),
  };
}
