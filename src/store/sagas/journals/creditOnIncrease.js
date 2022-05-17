import { newEntry, updateEntry, deleteEntry } from "./general";
/**
 * credit on increase (amount to be added)
 * debit on decrease (amount to be subtracted)
 */
export function newCreditOnIncrease(
  transaction,
  userProfile = { email: "" },
  orgId,
  data = {
    amount: 0,
    transactionType: "",
    transactionId: "",
    account: { id: "", name: "" },
    transactionDetails: "",
    reference: "",
  }
) {
  const { amount } = data;
  if (amount === 0) {
    throw new Error("Transaction Amount cannot be zero(0)");
  }
  //initialize. assuming amount is positive, asign to credit
  let debit = 0;
  let credit = amount;
  //reverse of amount is negative, credit 0, debit amount.
  //subtract from zero(0) to make positive
  if (amount < 0) {
    debit = 0 - amount;
    credit = 0;
  }
  console.log({ credit, debit, amount });

  newEntry(transaction, userProfile, orgId, {
    ...data,
    credit,
    debit,
  });
}

export function updateCreditOnIncrease(
  transaction,
  userProfile = { email: "" },
  orgId,
  currentData = {
    debit: 0,
    credit: 0,
    account: { id: "" },
  },
  amount = 0,
  entryId
) {
  if (amount === 0) {
    throw new Error("Transaction Amount cannot be zero(0)");
  }
  const { debit: currentDebit, credit: currentCredit } = currentData;
  if (currentData.debit > 0 && currentData.credit > 0) {
    throw new Error("Invalid data");
  }
  /**
   * if current credit >0 set current amount to credit amount
   * else, debit should be greater than zero:
   * set current amount to negative value of debit
   * subtract debit value from zero(0) to make it negative
   */
  let currentAmount = currentCredit > 0 ? currentCredit : 0 - currentDebit;

  /**
   * ascertain both amounts(current and incoming) are either debit or credit
   * debit- both values should be negative
   * credit- both values should be positive
   */
  if ((amount > 0 && currentAmount < 0) || (amount < 0 && currentAmount > 0)) {
    throw new Error(
      "Invalid data submitted! Cannot change a debit value to credit and vise versa"
    );
  }
  //value for adjusting the account summary
  const adjustment = amount - currentAmount;

  //initialize, assume amount is +ve, assign to credit
  let credit = amount;
  let debit = 0;
  /**
   * if amount is negative, assign to debit,
   * subtract amount from 0 to make it +ve
   */
  if (amount < 0) {
    credit = 0;
    debit = 0 - amount;
  }
  console.log({ credit, debit, amount, currentAmount, adjustment });

  updateEntry(
    transaction,
    userProfile,
    orgId,
    entryId,
    currentData.account.id,
    {
      accountSummaryAdjustment: adjustment,
      credit,
      debit,
    }
  );
}

export function deleteCreditOnIncrease(
  transaction,
  userProfile = { email: "" },
  orgId,
  entryId,
  data = {
    account: { id: "", name: "" },
    debit: 0,
    credit: 0,
  }
) {
  /**
   * if credit >0 subtract from account
   * if debit >0 add to account
   */
  const {
    account: { id: accountId },
    debit,
    credit,
  } = data;

  /**
   * check is debit is greater than zero(0)
   * assign debit to amount
   * else: credit must be greater than zero(0)
   * assign credit to amount
   * subtract credit from zero to make it negative
   */
  let amount = debit > 0 ? debit : 0 - credit;

  console.log({ credit, debit, amount });

  deleteEntry(transaction, userProfile, orgId, entryId, accountId, amount);
}
