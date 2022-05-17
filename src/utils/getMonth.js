export default function getMonth(date = new Date()) {
  const month = date.toDateString().substring(4, 7);
  const year = date.getFullYear();

  return `${year}-${month}`;
}
