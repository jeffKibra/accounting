import createCollectionRef from './createCollectionRef';

import {
  IContactFromDb,
  ExpenseFromDb,
  InvoiceFromDb,
  ItemFromDb,
  EntryFromDb,
  PaymentReceivedFromDb,
  SaleReceiptFromDb,
  TaxFromDb,
  IMonthBookings,
  IBookingFromDb,
} from '../../types';

export default function dbCollections(orgId: string) {
  const org = `organizations/${orgId}`;
  return {
    contacts: createCollectionRef<IContactFromDb>(`${org}/contacts`),
    expenses: createCollectionRef<ExpenseFromDb>(`${org}/expenses`),
    invoices: createCollectionRef<InvoiceFromDb>(`${org}/invoices`),
    bookings: createCollectionRef<IBookingFromDb>(`${org}/bookings`),
    monthlyBookings: createCollectionRef<IMonthBookings>(
      `${org}/monthlyBookings`
    ),
    items: createCollectionRef<ItemFromDb>(`${org}/items`),
    orgDetails: createCollectionRef<unknown>(`${org}/orgDetails`),
    entries: createCollectionRef<EntryFromDb>(`${org}/journals`),
    paymentsReceived: createCollectionRef<PaymentReceivedFromDb>(
      `${org}/payments`
    ),
    saleReceipts: createCollectionRef<SaleReceiptFromDb>(`${org}/saleReceipts`),
    taxes: createCollectionRef<TaxFromDb>(`${org}/taxes`),
    //     customers: createCollectionRef<Customer>(`${org}/customers`),
  };
}
