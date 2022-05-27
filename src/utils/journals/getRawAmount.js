import { isCreditOnIncrease, isDebitOnIncrease } from "./types";

export default function getRawAmount(
  accountType = { id: "", main: "" },
  data = { debit: 0, credit: 0 }
) {
  const { main } = accountType;
  const { credit, debit } = data;

  let amount = 0;

  if (isDebitOnIncrease(main)) {
    /**
     * if debit is greater than zero(0)
     * amount is +ve,
     * else credit is greater than zero(0)
     * amount is -ve
     */
    if (debit > 0) {
      amount = debit;
    } else if (credit > 0) {
      amount = 0 - credit;
    }
  } else if (isCreditOnIncrease(main)) {
    /**
     * if credit is greater than zero(0)
     * amount is +ve,
     * else debit is greater than zero(0)
     * amount is -ve
     */
    if (credit > 0) {
      amount = credit;
    } else if (debit > 0) {
      amount = 0 - debit;
    }
  }

  return amount;
}
