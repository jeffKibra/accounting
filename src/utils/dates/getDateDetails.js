/**
 *
 * @param {Date} date
 * @returns {{dateString:"",month:"",year:0,yearMonth:"",yearMonthDay:"",millis:0,date:Date,}}
 */
export default function getDateDetails(date = new Date()) {
  const month = date.toDateString().substring(4, 7);
  const year = date.getFullYear();
  const yearMonth = `${year}-${month}`;
  const yearMonthDay = `${yearMonth}-${date.getDate()}`;
  const millis = date.getTime();
  const dateString = date.toDateString();

  return {
    dateString,
    month,
    year,
    yearMonth,
    yearMonthDay,
    millis,
    date,
  };
}
