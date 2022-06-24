import { doc, serverTimestamp, increment } from "firebase/firestore";

import { db } from "../firebase";

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

export default async function createExpense(
  transaction,
  org = { id: "" },
  userProfile = { email: "" },
  accounts = [{ name: "", accountd: "", accountType: {} }],
  expenseId = "",
  data = {
    summary: {
      subTotal: 0,
      totalTaxes: 0,
      totalAmount: 0,
    },
    items: [
      {
        accountId: "",
        account: { name: "", accountd: "", accountType: {} },
        totalAmount: 0,
      },
    ],
    vendor: { vendorId: "" },
    expenseDate: new Date(),
    paymentAccount: { accountId: "" },
    paymentMode: { value: "" },
    reference: "",
  },
  transactionType = "expense"
) {
  const orgId = org.id;
  const { email } = userProfile;
  const { vendor, paymentAccount, paymentMode, summary, items, reference } =
    data;
  const { vendorId } = vendor;
  const { accountId: paymentAccountId } = paymentAccount;
  const { value: paymentModeId } = paymentMode;
  const { totalTaxes, totalAmount } = summary;
  // console.log({ data });
  /**
   * check is account has enough funds
   */

  // console.log({ items });
  const tDetails = {
    ...data,
    status: "active",
    transactionType,
    org: formats.formatOrgData(org),
    vendor: formats.formatVendorData(vendor),
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
  });

  /**
   * create expense
   */
  const expenseRef = doc(db, "organizations", orgId, "expenses", expenseId);
  // console.log({ expenseData });
  transaction.set(expenseRef, {
    ...tDetails,
    createdBy: email,
    createdAt: serverTimestamp(),
    modifiedBy: email,
    modifiedAt: serverTimestamp(),
  });
}
