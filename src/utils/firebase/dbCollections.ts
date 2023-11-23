import createCollectionRef from './createCollectionRef';

import {
  IContactFromDb,
  ExpenseFromDb,
  ItemFromDb,
  EntryFromDb,
  PaymentReceivedFromDb,
  SaleReceiptFromDb,
  IBookingFromDb,
} from '../../types';

export default function dbCollections(orgId: string) {
  const org = `organizations/${orgId}`;
  return {
    contacts: createCollectionRef<IContactFromDb>(`${org}/contacts`),
    expenses: createCollectionRef<ExpenseFromDb>(`${org}/expenses`),
    bookings: createCollectionRef<IBookingFromDb>(`${org}/bookings`),
    items: createCollectionRef<ItemFromDb>(`${org}/items`),
    orgDetails: createCollectionRef<unknown>(`${org}/orgDetails`),
    entries: createCollectionRef<EntryFromDb>(`${org}/journals`),
    paymentsReceived: createCollectionRef<PaymentReceivedFromDb>(
      `${org}/payments`
    ),
    saleReceipts: createCollectionRef<SaleReceiptFromDb>(`${org}/saleReceipts`),
    //     customers: createCollectionRef<Customer>(`${org}/customers`),
  };
}
