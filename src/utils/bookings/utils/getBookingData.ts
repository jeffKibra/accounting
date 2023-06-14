import { doc, Transaction } from 'firebase/firestore';
import { dbCollections } from '../../firebase';

import { IBooking } from '../../../types';

export default async function getBookingData(
  transaction: Transaction,
  orgId: string,
  bookingId: string
) {
  const bookingsCollection = dbCollections(orgId).bookings;

  const bookingRef = doc(bookingsCollection, bookingId);
  const bookingDoc = await transaction.get(bookingRef);
  let bookingData = bookingDoc.data();

  if (
    !bookingDoc.exists ||
    bookingDoc.data()?.status === -1 ||
    bookingData === undefined
  ) {
    throw new Error(`Booking with id ${bookingId} not found!`);
  }

  const data: IBooking = {
    ...bookingData,
    id: bookingId,
  };

  return data;
}
