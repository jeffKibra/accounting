import { doc, serverTimestamp, increment } from "firebase/firestore";

import { db } from "../firebase";

import { createSimilarAccountEntries } from "../journals";
import {
  getAccountData,
  getAccountsMapping,
  getIncomeAccountsMapping,
} from "../accounts";
import formats from "../formats";
import { getDateDetails } from "../dates";

export default async function createExpense(
  transaction,
  org = { id: "" },
  userProfile = { email: "" },
  accounts = [{ name: "", accountd: "", accountType: {} }],
  salesReceiptId = "",
  data = {
    customerId: "",
    customer: {},
    summary: {
      shipping: 0,
      adjustment: 0,
      subTotal: 0,
      totalTaxes: 0,
      totalAmount: 0,
    },
    selectedItems: [
      {
        salesAccountId: "",
        salesAccount: { name: "", accountd: "", accountType: {} },
        totalAmount: 0,
      },
    ],
    receiptDate: new Date(),
    accountId: "",
    account: {},
    paymentModeId: "",
    paymentMode: {},
    reference: "",
    customerNotes: "",
  },
  transactionType = "sales receipt"
) {
  const orgId = org.id;
  const { email } = userProfile;
  const {
    customerId,
    customer,
    summary,
    selectedItems,
    accountId,
    reference,
    paymentModeId,
  } = data;
  const { totalTaxes, adjustment, shipping, totalAmount } = summary;
  // console.log({ data });

  // console.log({ selectedItems });
  const tDetails = {
    ...data,
    status: "active",
    isSent: false,
    transactionType,
    org: formats.formatOrgData(org),
    customer: formats.formatCustomerData(customer),
    selectedItems: formats.formatSaleItems(selectedItems),
  };
  const transactionDetails = {
    ...tDetails,
    salesReceiptId,
  };
  const transactionId = salesReceiptId;

  /**
   * create journal entries for income accounts
   */
  let { newAccounts } = getIncomeAccountsMapping([], selectedItems);
  const summaryAccounts = getAccountsMapping([
    { accountId: "shipping_charge", incoming: shipping, current: 0 },
    { accountId: "other_charges", incoming: adjustment, current: 0 },
    { accountId: "tax_payable", incoming: totalTaxes, current: 0 },
    { accountId, incoming: totalAmount, current: 0 },
  ]);
  newAccounts = [...newAccounts, ...summaryAccounts.newAccounts];

  newAccounts.forEach((newAccount) => {
    const { accountId, incoming } = newAccount;
    const salesAccount = getAccountData(accountId, accounts);

    createSimilarAccountEntries(transaction, userProfile, orgId, salesAccount, [
      {
        amount: incoming,
        account: salesAccount,
        reference,
        transactionId,
        transactionType,
        transactionDetails,
      },
    ]);
  });
  /**
   * update customer summaries if a customer was selected
   */
  if (customerId) {
    const customerRef = doc(
      db,
      "organizations",
      orgId,
      "customers",
      customerId
    );

    transaction.update(customerRef, {
      "summary.salesReceipts": increment(1),
      "summary.salesReceiptsAmount": increment(summary.totalAmount),
    });
  }
  /**
   * update org summaries
   */
  const { yearMonthDay } = getDateDetails();
  const summaryRef = doc(db, "organizations", orgId, "summaries", yearMonthDay);
  transaction.update(summaryRef, {
    salesReceipts: increment(1),
    [`paymentModes.${paymentModeId}`]: increment(totalAmount),
  });

  /**
   * create salesReceipt
   */
  const salesReceiptRef = doc(
    db,
    "organizations",
    orgId,
    "salesReceipts",
    salesReceiptId
  );
  // console.log({ salesReceiptData });
  transaction.set(salesReceiptRef, {
    ...tDetails,
    createdBy: email,
    createdAt: serverTimestamp(),
    modifiedBy: email,
    modifiedAt: serverTimestamp(),
  });
}
