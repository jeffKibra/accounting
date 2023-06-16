import { doc, getDoc } from 'firebase/firestore';

//

//
import { dbCollections } from '../../utils/firebase';
//

//----------------------------------------------------------------

import { getDatesWithinRange } from '../../utils/dates';
//
import {
  ItemType,
  // IBookingDateRange,
  IMonthlyBookings,
  Item,
} from '../../types';

//----------------------------------------------------------------
// type IUngroupedDates = Record<string, string>;
// type IDatesGroupedInMonths = Record<string, IUngroupedDates>;
//----------------------------------------------------------------

export default class Bookings {
  //   ------------------------------------------------------------------
  //   Static methods
  //   -------------------------------------------------------------------

  static async getMonthBookings(orgId: string, monthId: string) {
    try {
      const collectionRef = dbCollections(orgId).monthlyBookings;
      const docRef = doc(collectionRef, monthId);

      const docSnap = await getDoc(docRef);

      const data = docSnap.data();

      if (!data) {
        return null;
      }

      return {
        ...data,
      };
    } catch (err) {
      const error = err as Error;
      console.error(`Error fetching month: ${monthId} bookings: `, error);

      throw error;
    }
  }

  // static dispatch(dispatchFn: () => {} | null, args: DispatchProp) {
  //   if (dispatchFn && typeof dispatchFn === 'function') {
  //     dispatchFn(...args);
  //   }
  // }

  static async getMonthlyBookings(
    orgId: string,
    months: string[]
    // dispatchToStore?: () => {}
  ) {
    const monthlyBookings: IMonthlyBookings = {};

    await Promise.all(
      months.map(async monthId => {
        const monthBookings = await Bookings.getMonthBookings(orgId, monthId);
        monthlyBookings[monthId] = monthBookings;

        return monthBookings;
      })
    );

    return monthlyBookings;
  }
  //-----------------------------------------------------------------------
  //-----------------------------------------------------------------------

  static getItemsNotBooked(
    monthlyBookings: IMonthlyBookings,
    selectedDatesGroupedInMonths: Record<string, Record<string, string>>,
    items: Item[],
    defaultItemId?: string,
    defaultBookingDays?: Record<string, string>
  ) {
    // console.log({
    //   monthlyBookings,
    //   selectedDatesGroupedInMonths,
    //   defaultItemId,
    //   defaultBookingDays,
    // });
    const months = Object.keys(monthlyBookings);

    const allItems: Record<string, Item> = {};
    items.forEach(item => {
      const { itemId } = item;
      allItems[itemId] = item;
    });

    const dailyBookings: Record<string, Record<string, string>> = {}; //{date1:{item1:item1,item2:item2}}

    function updateDayBookings(day: string, itemId: string) {
      const dayBookings = dailyBookings[day];

      if (dayBookings) {
        dailyBookings[day][itemId] = itemId;
      } else {
        dailyBookings[day] = { [itemId]: itemId };
      }
    }

    //convert monthly bookings to objects only: //{date1:{item1:item1,item2:item2}}
    months.forEach(monthId => {
      const monthBookings = monthlyBookings[monthId];

      if (monthBookings) {
        const bookedItems = Object.keys(monthBookings);
        bookedItems.forEach(itemId => {
          const itemMonthBookings = monthBookings[itemId];
          if (Array.isArray(itemMonthBookings)) {
            itemMonthBookings.forEach(day => {
              let dayIsBeingEdited = false;
              if (defaultItemId === itemId) {
                /**
                 * this is the current booked item
                 * check if the item booking for the day is the one being edited
                 * if true, dont add day to booked days.
                 */
                if (defaultBookingDays) {
                  dayIsBeingEdited = Boolean(defaultBookingDays[day]);
                }
              }

              // console.log({ itemId, defaultItemId, day, dayIsBeingEdited });

              if (!dayIsBeingEdited) {
                updateDayBookings(day, itemId);
              }
            });
          }
        });
      }
    });

    // console.log({ dailyBookings });

    const selectedMonths = Object.keys(selectedDatesGroupedInMonths);
    // console.log({ selectedMonths });

    selectedMonths.forEach(selectedMonth => {
      const selectedMonthDates = selectedDatesGroupedInMonths[selectedMonth];
      Object.keys(selectedMonthDates).forEach(selectedDate => {
        //check if there is an item booked today. delete from list if booked
        const alreadyBookedItems = dailyBookings[selectedDate];
        // console.log({ selectedDate, alreadyBookedItems });
        if (alreadyBookedItems) {
          Object.keys(alreadyBookedItems).forEach(alreadyBookedItemId => {
            //delete item from list
            delete allItems[alreadyBookedItemId];
          });
        }
      });
    });

    // console.log({ allItems });

    return allItems;
  }

  //-----------------------------------------------------------------------
  // static get

  //------------------------------------------------------------------------------
  static getBookingDays(start: string | Date, end: string | Date) {
    const startDate = new Date(start);
    if (startDate.toDateString() === 'Invalid Date') {
      throw new TypeError('Invalid Booking start date');
    }

    const endDate = new Date(end);
    if (endDate.toDateString() === 'Invalid Date') {
      throw new TypeError('Invalid Booking End date');
    }

    const datesWithinRange = getDatesWithinRange(startDate, endDate);

    // console.log({ datesWithinRange });

    return datesWithinRange;
  }

  //-------------------------------------------------------------------------

  static isItemABooking(itemType: ItemType) {
    return itemType === 'vehicle'; // append other or types if necessary
  }
  //----------------------------------------------------------------

  //----------------------------------------------------------------

  //----------------------------------------------------------------

  //----------------------------------------------------------------

  static getLocaleDate(date: Date, timeZone = 'Africa/Nairobi') {
    const localeDate = new Date(date).toLocaleString('en-US', {
      timeZone,
    });
    // console.log({ localeDate });

    return localeDate;
  }
  //----------------------------------------------------------------
  static checkIfDateIsValid(
    date: string | number | Date,
    itemName: string,
    isStartDate = false
  ) {
    const dateNotValid = new Date(date).toDateString() === 'Invalid Date';
    // console.log({ dateNotValid });

    if (!date || dateNotValid) {
      throw new Error(
        `Invalid Booking ${
          isStartDate ? 'start' : 'end'
        } date for booking item: ${itemName}`
      );
    }
  }
  //----------------------------------------------------------------
}
