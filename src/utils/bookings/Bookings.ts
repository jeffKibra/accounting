import { doc, getDoc } from 'firebase/firestore';

//

//
import { dbCollections } from '../../utils/firebase';
//

//----------------------------------------------------------------

import { getDatesWithinRangeGroupedInMonths } from '../../utils/dates';
//
import {
  ItemType,
  IBookingDateRange,
  IMonthlyBookings,
  Item,
} from '../../types';

//----------------------------------------------------------------
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
    items: Item[]
  ) {
    // console.log({ monthlyBookings, selectedDatesGroupedInMonths });
    const months = Object.keys(monthlyBookings);

    const dailyBookings: Record<string, Record<string, string>> = {}; //{date1:{item1:item1,item2:item2}}

    const allItems: Record<string, Item> = {};
    items.forEach(item => {
      const { itemId } = item;
      allItems[itemId] = item;
    });

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
              updateDayBookings(day, itemId);
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
        //check if there is an item booked today. delete from liste if booked
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

  static getBookingDays(dateRange: [string, string] | null) {
    if (!dateRange) {
      return {};
    }

    if (!Array.isArray(dateRange)) {
      throw new TypeError('Booking dateRange must be an array');
    }

    const start = dateRange[0];
    const end = dateRange[1] || start; //incase end date is null

    const startDate = new Date(start);
    if (startDate.toDateString() === 'Invalid Date') {
      throw new TypeError('Invalid Booking start date');
    }

    const endDate = new Date(end);

    const datesGroupedInMonths = getDatesWithinRangeGroupedInMonths(
      startDate,
      endDate
    );

    console.log({ datesGroupedInMonths });

    return datesGroupedInMonths;
  }

  //-------------------------------------------------------------------------

  static isItemABooking(itemType: ItemType) {
    return itemType === 'vehicle'; // append other or types if necessary
  }
  //----------------------------------------------------------------
  static generateAccurateBookingDateRange(
    formDateRange: IBookingDateRange | null,
    itemType: ItemType,
    itemName: string
  ) {
    const itemIsABooking = Bookings.isItemABooking(itemType);

    if (!itemIsABooking) {
      return null;
    }

    if (!Array.isArray(formDateRange)) {
      throw new Error(`Invalid Date Range for booking item: ${itemName}`);
    }

    const formStartDate = formDateRange[0];
    const formEndDate = formDateRange[1] || formStartDate;

    Bookings.checkIfDateIsValid(formStartDate, itemName, true);
    Bookings.checkIfDateIsValid(formEndDate, itemName);

    const startDate = Bookings.generateAccurateStartDate(
      new Date(formStartDate)
    );
    const endDate = Bookings.generateAccurateEndDate(new Date(formEndDate));

    const dateRange: IBookingDateRange = [
      startDate.toDateString(),
      endDate.toDateString(),
    ];

    return dateRange;
  }
  //----------------------------------------------------------------
  static generateAccurateStartDate(date: Date, gmt = '+3') {
    const dateString = new Date(date).toDateString();
    const midnightTimeString = '00:00:00:000'; //GMT+0300

    const accurateStartDate = new Date(
      `${dateString} ${midnightTimeString} GMT${gmt || ''}`
    );
    // console.log({ accurateStartDate });

    return accurateStartDate;
  }

  //----------------------------------------------------------------
  static generateAccurateEndDate(date: Date, gmt = '+3') {
    const dateString = new Date(date).toDateString();
    const beforeMidnightTimeString = '23:59:59:999'; //GMT+0300

    const accurateEndDate = new Date(
      `${dateString} ${beforeMidnightTimeString} GMT${gmt || ''}`
    );
    // console.log({ accurateEndDate });

    return accurateEndDate;
  }

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
