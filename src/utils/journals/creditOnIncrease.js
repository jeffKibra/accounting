import { newEntry, updateEntry, deleteEntry } from "./general";
/**
 * credit on increase (amount to be added)
 * debit on decrease (amount to be subtracted)
 */
export function newCreditOnIncrease(
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
  // if (amount === 0) {
  //   throw new Error("Transaction Amount cannot be zero(0)");
  // }
  //initialize. assuming amount is positive, asign to credit
  let debit = 0;
  let credit = amount;
  //reverse of amount is negative, credit 0, debit amount.
  //subtract from zero(0) to make positive
  if (amount < 0) {
    debit = 0 - amount;
    credit = 0;
  }
  // console.log({ credit, debit, amount });

  newEntry(transaction, userProfile, orgId, accountId, {
    ...data,
    credit,
    debit,
  });
}

export function updateCreditOnIncrease(
  transaction,
  userProfile = { email: "" },
  orgId,
  accountId,
  entryId,
  amount = 0,
  currentData = {
    debit: 0,
    credit: 0,
  },
  transactionDetails = {}
) {
  /**
   * amount should be the raw value not the adjsutement of the value
   */
  // if (amount === 0) {
  //   throw new Error("Transaction Amount cannot be zero(0)");
  // }
  const { debit: currentDebit, credit: currentCredit } = currentData;
  //atleast either debit or credit should be zero
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

  //value for adjusting the account summary
  const adjustment = amount - currentAmount;

  /**
   * scenarios
   * scene1:amount is +ve - credit the amount
   * scene1 is assumed by default when initializing debit and credit
   * scene2:amount is -ve - debit the amount
   */
  //scene1
  let credit = amount;
  let debit = 0;
  //scene2
  if (amount < 0) {
    /**
     * make credit zero(0) and assign amount to debit
     * subtract value from zero to make +ve
     */
    credit = 0;
    debit = 0 - amount;
  }

  // console.log({ credit, debit, amount, currentAmount, adjustment });

  updateEntry(transaction, userProfile, orgId, entryId, accountId, {
    accountSummaryAdjustment: adjustment,
    credit,
    debit,
    amount,
    transactionDetails,
  });
}

export function deleteCreditOnIncrease(
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
   * if credit >0 subtract from account
   * if debit >0 add to account
   */
  const { debit, credit } = data;

  /**
   * check is debit is greater than zero(0)
   * assign debit to amount
   * else: credit must be greater than zero(0)
   * assign credit to amount
   * subtract credit from zero to make it negative
   */
  let amount = debit > 0 ? debit : 0 - credit;

  // console.log({ credit, debit, amount });

  deleteEntry(transaction, userProfile, orgId, entryId, accountId, amount);
}
