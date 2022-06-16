import {
  ASSET,
  EQUITY,
  INCOME,
  EXPENSE,
  LIABILITY,
} from "../../constants/ledgers";

export function isDebitOnIncrease(main = "") {
  return main === ASSET || main === EXPENSE;
}

export function isCreditOnIncrease(main = "") {
  return main === LIABILITY || main === EQUITY || main === INCOME;
}
