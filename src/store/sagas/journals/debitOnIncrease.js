import { newEntry, updateEntry, deleteEntry } from "./general";
/**
 * debit on increase (amount to be added)
 * credit on decrease (amount to be subtracted)
 */
export function newDebitOnIncrease(
  transaction,
  userProfile = { email: "" },
  orgId,
  accountId,
  data = {
    amount: 0,
    transactionType: "",
    transactionId: "",
    transactionDetails: "",
    reference: "",
    account: {
      accountId: "",
      accountType: { id: "", main: "", name: "" },
      name: "",
    },
  }
) {
  const { amount } = data;
  if (amount === 0) {
    throw new Error("Transaction Amount cannot be zero(0)");
  }
  let debit = amount;
  let credit = 0;

  if (amount < 0) {
    debit = 0;
    credit = 0 - amount;
  }
  console.log({ credit, debit, amount });

  newEntry(transaction, userProfile, orgId, accountId, {
    ...data,
    credit,
    debit,
  });
}

export function updateDebitOnIncrease(
  transaction,
  userProfile = { email: "" },
  orgId,
  accountId,
  entryId,
  amount = 0,
  currentData = {
    debit: 0,
    credit: 0,
  }
) {
  /**
   * amount should be the raw value not the adjsutement of the value
   */
  if (amount === 0) {
    throw new Error("Transaction Amount cannot be zero(0)");
  }
  const { debit: currentDebit, credit: currentCredit } = currentData;
  if (currentData.debit > 0 && currentData.credit > 0) {
    throw new Error("Invalid data");
  }
  /**
   * set current amount
   * if current debit >0 set current ammount to be debit
   * if current credit >0 set current amount to be negative value of credit
   * subtract credit value from zero(0) to make it negative
   */
  let currentAmount = currentCredit > 0 ? 0 - currentCredit : currentDebit;

  /**
   * ascertain both amounts(current and incoming) are either debit or credit
   * debit- both values should be positive
   * credit- both values should be negative
   */
  if ((amount > 0 && currentAmount < 0) || (amount < 0 && currentAmount > 0)) {
    throw new Error(
      "Invalid data submitted! Cannot change a debit value to credit and vise versa"
    );
  }

  //value for adjusting the account summary
  //subtract current amount from the incoming account
  const adjustment = amount - currentAmount;

  let debit = amount;
  let credit = 0;

  if (amount < 0) {
    debit = 0;
    credit = 0 - amount;
  }
  console.log({ credit, debit, amount, currentAmount, adjustment });

  updateEntry(transaction, userProfile, orgId, entryId, accountId, {
    accountSummaryAdjustment: adjustment,
    debit,
    credit,
  });
}

export function deleteDebitOnIncrease(
  transaction,
  userProfile = { email: "" },
  orgId,
  entryId,
  accountId,
  data = {
    debit: 0,
    credit: 0,
  }
) {
  /**
   * if debit >0 subtract from account
   * if credit >0 add to account
   */
  const { debit, credit } = data;

  /**
   * check is credit is greater than zero(0)
   * assign credit to amount
   * else: debit must be greater than zero(0)
   * assign debit to amount
   * subtract debit from zero to make it negative
   */
  let amount = credit > 0 ? credit : 0 - debit;

  console.log({ credit, debit, amount });

  deleteEntry(transaction, userProfile, orgId, entryId, accountId, amount);
}
