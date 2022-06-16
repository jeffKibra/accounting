import { isCreditOnIncrease, isDebitOnIncrease } from "./types";

export default function createDebitAndCredit(
  accountType = { id: "", main: "" },
  amount = 0
) {
  const { main } = accountType;

  let credit = 0,
    debit = 0;

  if (amount !== 0) {
    if (isDebitOnIncrease(main)) {
      /**
       * if amount is +ve, debit it
       * else credit it (subtract from zero(0)) to make +ve
       */
      if (amount > 0) {
        debit = amount;
        credit = 0;
      } else {
        debit = 0;
        credit = 0 - amount;
      }
    } else if (isCreditOnIncrease(main)) {
      /**
       * if amount is +ve, credit it
       * else debit it (subtract from zero(0)) to make +ve
       */
      if (amount > 0) {
        credit = amount;
        debit = 0;
      } else {
        credit = 0;
        debit = 0 - amount;
      }
    }
  }

  return { credit, debit };
}
