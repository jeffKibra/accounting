export default function confirmFutureDate(
  referenceDate = new Date(),
  futureDate = new Date()
) {
  const referenceYear = referenceDate.getFullYear();
  const referenceMonth = referenceDate.getMonth();
  const referenceMonthDate = referenceDate.getDate();

  const futureYear = futureDate.getFullYear();
  const futureMonth = futureDate.getMonth();
  const futureMonthDate = futureDate.getDate();

  let isLess = false;

  if (
    futureYear < referenceYear ||
    (referenceYear === futureYear && futureMonth < referenceMonth) ||
    (referenceYear === futureYear &&
      referenceMonth === futureMonth &&
      futureMonthDate < referenceMonthDate)
  ) {
    isLess = true;
  }

  return !isLess;
}
