import {
  ASSET,
  EQUITY,
  INCOME,
  EXPENSE,
  LIABILITY,
} from "../../constants/ledgers";

export function isDebitOnIncrease(main: string) {
  return main === ASSET || main === EXPENSE;
}

export function isCreditOnIncrease(main: string) {
  return main === LIABILITY || main === EQUITY || main === INCOME;
}
