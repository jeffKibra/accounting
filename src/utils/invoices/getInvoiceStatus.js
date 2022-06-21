import { isSameDay } from "../dates";

function getDaysDifference(date = new Date(), biggerDate = new Date()) {
  return Math.floor(
    (biggerDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
}

export default function getInvoiceStatus({
  dueDate = new Date(),
  balance = 0,
  summary = { totalAmount: 0 },
  isSent = false,
}) {
  const { totalAmount } = summary;
  const today = new Date();
  const isDue = dueDate.getTime() > today.getTime();
  const daysDue = getDaysDifference(today, dueDate);

  const dueToday = isSameDay(today, dueDate);

  const partiallyPaid = balance < totalAmount;

  //   const overdue = today.getTime() > dueDate.getTime();
  const overdueDays = getDaysDifference(dueDate, today);

  let status = "";
  let message = "";

  if (balance === 0) {
    status = "PAID";
  } else if (partiallyPaid && (dueToday || isDue)) {
    status = "PARTIALLY PAID";
  } else if (dueToday) {
    status = "DUE TODAY";
  } else if (isDue) {
    status = isSent ? "SENT" : "PENDING";
  } else {
    status = `OVERDUE`;
  }

  switch (status) {
    case "PAID":
    case "PARTIALLY PAID":
    case "DUE TODAY":
      message = status;
      break;
    case "SENT":
    case "PENDING":
      message = `DUE IN ${daysDue} DAYS`;
      break;
    case "OVERDUE":
      message = `OVERDUE BY ${overdueDays} DAYS`;
      break;
    default:
      message = status;
  }

  return { status, message };
}