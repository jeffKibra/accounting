export function dateFromTimestamp(timestamp = { seconds: 0 }) {
  return new Date(timestamp.seconds * 1000);
}

export function isSameDay(date1 = new Date(), date2 = new Date()) {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}
