import {
  doc,
  serverTimestamp,
  increment,
  Transaction,
} from "firebase/firestore";

import { db, dbCollections } from "../firebase";

import { createSimilarAccountEntries } from "../journals";
import { getAccountData, getAccountsMapping } from "../accounts";
import formats from "../formats";
import { getDateDetails } from "../dates";
import { getEntryAmount } from ".";

import {
  Org,
  UserProfile,
  Account,
  ExpenseFormData,
  ExpenseFromDb,
  TransactionTypes,
} from "types";

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
  transactionType: keyof Pick<TransactionTypes, "expense"> = "expense"
) {
  const { orgId } = org;
  const { email } = userProfile;
  const { paymentAccount, paymentMode, summary, items, reference, vendor } =
    data;
  // const { vendorId } = vendor;
  const { accountId: paymentAccountId } = paymentAccount;
  const { value: paymentModeId } = paymentMode;
  const { totalTax, totalAmount } = summary;
  // console.log({ data });
  /**
   * check is account has enough funds
   */

  // console.log({ items });
  const tDetails: TDetails = {
    ...data,
    status: "active",
    transactionType,
    org: formats.formatOrgData(org),
    items: items,
  };
  /**
   * if the vendor is not undefined, add it to the object
   */
  if (vendor) {
    tDetails.vendor = formats.formatVendorData(vendor);
  }
  const transactionDetails = {
    ...tDetails,
    expenseId,
  };
  const transactionId = expenseId;

  /**
   * create journal entries for income accounts
   */
  const allItems = [
    ...items.map((item) => {
      const {
        account: { accountId },
        itemRate,
      } = item;
      return { accountId, amount: itemRate };
    }),
    { accountId: "tax_payable", amount: totalTax },
    { accountId: paymentAccountId, amount: totalAmount },
  ];
  const { newAccounts } = getAccountsMapping([], allItems);

  newAccounts.forEach((newAccount) => {
    const { accountId, incoming } = newAccount;
    const expenseAccount = getAccountData(accountId, accounts);

    let amount = getEntryAmount(incoming, expenseAccount, paymentAccountId);
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
  if (vendor) {
    let vendorId = vendor.vendorId || "";

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
