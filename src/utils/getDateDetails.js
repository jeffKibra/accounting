/**
 *
 * @param {Date} date
 * @returns {{month:'', year:"", yearMonth:"", millis:0}}
 */
export default function getDateDetails(date = new Date()) {
  const month = date.toDateString().substring(4, 7);
  const year = date.getFullYear();
  const yearMonth = `${year}-${month}`;
  const millis = date.getTime();

  return {
    month,
    year,
    yearMonth,
    millis,
  };
}
