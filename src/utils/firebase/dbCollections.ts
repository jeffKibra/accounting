import { createCollection } from ".";

import {
  CustomerFromDb,
  ExpenseFromDb,
  InvoiceFromDb,
  ItemFromDb,
  VendorFromDb,
  EntryFromDb,
  PaymentReceivedFromDb,
  SalesReceiptFromDb,
  TaxFromDb,
} from "../../types";

export default function dbCollections(orgId: string) {
  const org = `organizations/${orgId}`;
  return {
    customers: createCollection<CustomerFromDb>(`${org}/customers`),
    expenses: createCollection<ExpenseFromDb>(`${org}/expenses`),
    invoices: createCollection<InvoiceFromDb>(`${org}/invoices`),
    items: createCollection<ItemFromDb>(`${org}/items`),
    vendors: createCollection<VendorFromDb>(`${org}/vendors`),
    entries: createCollection<EntryFromDb>(`${org}/journals`),
    paymentsReceived: createCollection<PaymentReceivedFromDb>(
      `${org}/payments`
    ),
    salesReceipts: createCollection<SalesReceiptFromDb>(`${org}/salesReceipts`),
    taxes: createCollection<TaxFromDb>(`${org}/taxes`),
    //     customers: createCollection<Customer>(`${org}/customers`),
  };
}
