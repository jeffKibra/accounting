import { isCreditOnIncrease, isDebitOnIncrease } from "./types";

import { AccountType } from "../../models";
import { Entry } from "../../models";

export default function getRawAmount(accountType: AccountType, data: Entry) {
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
