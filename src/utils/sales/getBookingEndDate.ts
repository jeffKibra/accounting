import { getFutureDate } from '../dates';

/**
 * function returns end date at 23:59:59:999=just a millisecond before midnight
 *
 */

export default function getBookingEndDate(startDate: Date, days: number) {
  console.log({ startDate, days });
  const futureDate = getFutureDate(days, startDate); //value is midnight in the start of new day
  console.log({ futureDate });
  const futureDateMillis = futureDate.getTime();
  console.log({ futureDateMillis });
  //subtract 1ms from futureDateMillis to get time 1ms before midnight
  const endDateMillis = futureDateMillis - 1;
  const endDate = new Date(endDateMillis);
  console.log({ endDate });

  return endDate;
}
