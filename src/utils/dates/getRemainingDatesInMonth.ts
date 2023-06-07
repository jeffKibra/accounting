import getMonthString from "./getMonthString";

export default function getRemainingDatesInMonth(
  start: Date,
  lastDayOfTheMonth: number
) {
  const startDate = new Date(start);
  const startDay = startDate.getDate();
  const year = startDate.getFullYear();

  const monthString = getMonthString(startDate);
  console.log({ monthString });

  const dates: Record<string, string> = {};

  for (let day = startDay; day <= lastDayOfTheMonth; day++) {
    const currentDate = `${year}-${monthString}-${day}`;
    dates[currentDate] = currentDate;
  }

  console.log({ dates });

  return {
    month: `${year}-${monthString}`,
    dates,
  };
}
