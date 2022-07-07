import { createCollection } from ".";

import {
  CustomerFromDb,
  ExpenseFromDb,
  InvoiceFromDb,
  Item,
  VendorFromDb,
  EntryFromDb,
  PaymentReceivedFromDb,
} from "../../types";

export default function dbCollections(orgId: string) {
  const org = `organizations/${orgId}`;
  return {
    customers: createCollection<CustomerFromDb>(`${org}/customers`),
    expenses: createCollection<ExpenseFromDb>(`${org}/expenses`),
    invoices: createCollection<InvoiceFromDb>(`${org}/invoices`),
    items: createCollection<Item>(`${org}/items`),
    vendors: createCollection<VendorFromDb>(`${org}/vendors`),
    entries: createCollection<EntryFromDb>(`${org}/journals`),
    paymentsReceived: createCollection<PaymentReceivedFromDb>(
      `${org}/paymentsReceived`
    ),
    //     customers: createCollection<Customer>(`${org}/customers`),
  };
}
