import { useState } from 'react';

//---------------------------------------------------------------

export default function useLoadAvailableItems(defaultDate) {
  const [date, setDate] = useState(new Date(defaultDate || Date.now()));

  function handleDateChange(incomingDate) {
    console.log({ incomingDate });
    setDate(incomingDate);
  }

  return { date, handleDateChange };
}
