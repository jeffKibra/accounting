export default function getFutureDate(days, startDate = new Date()) {
  const months = {
    1: 31,
    2: 28,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31,
  };

  function updateLeapYear(year = 0) {
    let feb = 28;
    if (year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)) {
      //leap year
      feb = 29;
    }
    months[2] = feb;
  }

  let month = startDate.getMonth() + 1;
  let year = startDate.getFullYear();
  /**
   * initialize remaining month days based on the current date and month
   */
  let remainingDays = months[month] - startDate.getDate();
  /**
   * update months before starting loop
   */
  updateLeapYear(year);

  while (true) {
    //stopping condition
    if (days <= remainingDays) {
      //end the loop
      break;
    } else {
      //increase month by 1
      month += 1;
      if (month > 12) {
        /**
         * is new month value greater than 12,
         * reset month to one and increase year  by one
         */
        month = 1;
        year += 1;
        /**
         * year has changed
         * update leap year values
         */
        updateLeapYear(year);
      }
      //reduce the overall days
      days = days - remainingDays;
      //update remaining month days based on new month
      remainingDays = months[month];
    }
  }
  /**
   * return new date
   */
  const startMonth = startDate.getMonth() + 1;
  const startYear = startDate.getFullYear();

  if (month === startMonth && startYear === year) {
    days = days + startDate.getDate();
  }

  return new Date(`${year}-${month}-${days}`);
}
