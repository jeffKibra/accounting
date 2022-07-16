import {
  doc,
  serverTimestamp,
  increment,
  Transaction,
} from "firebase/firestore";

import { db, dbCollections } from "../firebase";

import {
  createSimilarAccountEntries,
  createDebitAmount,
  createCreditAmount,
} from "../journals";
import {
  getAccountData,
  getAccountsMapping,
  getExpenseAccountsMapping,
} from "../accounts";
import formats from "../formats";
import { getDateDetails } from "../dates";

import {
  Org,
  UserProfile,
  Account,
  ExpenseFormData,
  ExpenseFromDb,
  VendorSummary,
} from "../../types";

interface TDetails
  extends Omit<
    ExpenseFromDb,
    "createdAt" | "createdBy" | "modifiedBy" | "modifiedAt"
  > {}

export default async function createExpense(
  transaction: Transaction,
  org: Org,
  userProfile: UserProfile,
  accounts: Account[],
  expenseId: string,
  data: ExpenseFormData,
  transactionType: string = "expense"
) {
  const { orgId } = org;
  const { email } = userProfile;
  const { paymentAccount, paymentMode, summary, items, reference } = data;
  // const { vendorId } = vendor;
  const { accountId: paymentAccountId } = paymentAccount;
  const { value: paymentModeId } = paymentMode;
  const { totalTaxes, totalAmount } = summary;
  // console.log({ data });
  /**
   * check is account has enough funds
   */
  let formVendor = data.vendor;
  let vendor: VendorSummary | null = formVendor
    ? formats.formatVendorData(formVendor)
    : formVendor;
  let vendorId: string = formVendor ? formVendor.vendorId : "";

  // console.log({ items });
  const tDetails: TDetails = {
    ...data,
    status: "active",
    transactionType,
    org: formats.formatOrgData(org),
    vendor,
    items: formats.formatExpenseItems(items),
  };
  const transactionDetails = {
    ...tDetails,
    expenseId,
  };
  const transactionId = expenseId;

  /**
   * create journal entries for income accounts
   */
  let { newAccounts } = getExpenseAccountsMapping([], items);
  const summaryAccounts = getAccountsMapping([
    { accountId: "tax_payable", incoming: totalTaxes, current: 0 },
    { accountId: paymentAccountId, incoming: totalAmount, current: 0 },
  ]);
  newAccounts = [...newAccounts, ...summaryAccounts.newAccounts];

  newAccounts.forEach((newAccount) => {
    const { accountId, incoming } = newAccount;
    const expenseAccount = getAccountData(accountId, accounts);
    const { accountType } = expenseAccount;

    let amount = incoming;
    if (accountId === paymentAccountId) {
      //this account should be credited
      amount = createCreditAmount(accountType, incoming);
    } else {
      //all other accounts should be debited
      amount = createDebitAmount(accountType, incoming);
    }
    console.log({ amount, accountId });

    createSimilarAccountEntries(
      transaction,
      userProfile,
      orgId,
      expenseAccount,
      [
        {
          amount,
          account: expenseAccount,
          reference,
          transactionId,
          transactionType,
          transactionDetails,
        },
      ]
    );
  });
  /**
   * update vendor summaries if a vendor was selected
   */
  if (vendorId) {
    const vendorRef = doc(db, "organizations", orgId, "vendors", vendorId);

    transaction.update(vendorRef, {
      "summary.expenses": increment(1),
      "summary.totalExpenses": increment(summary.totalAmount),
    });
  }
  /**
   * update org summaries
   */
  const { yearMonthDay } = getDateDetails();
  const summaryRef = doc(db, "organizations", orgId, "summaries", yearMonthDay);
  /**
   * this is an expense, subtract amount from paymentMode
   */
  transaction.update(summaryRef, {
    expenses: increment(1),
    [`paymentModes.${paymentModeId}`]: increment(0 - totalAmount),
    "cashFlow.outgoing": increment(totalAmount),
  });

  /**
   * create expense
   */
  const expensesCollection = dbCollections(orgId).expenses;
  const expenseRef = doc(expensesCollection, expenseId);
  // console.log({ expenseData });

  transaction.set(expenseRef, {
    ...tDetails,
    createdBy: email,
    createdAt: serverTimestamp(),
    modifiedBy: email,
    modifiedAt: serverTimestamp(),
  });
}
