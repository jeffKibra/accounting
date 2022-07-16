import {
  doc,
  serverTimestamp,
  increment,
  Transaction,
} from "firebase/firestore";

import { db, dbCollections } from "../firebase";

import { createSimilarAccountEntries } from "../journals";
import {
  getAccountData,
  getAccountsMapping,
  getIncomeAccountsMapping,
} from "../accounts";
import formats from "../formats";
import { getDateDetails } from "../dates";

import { UserProfile, Org, Account, SalesReceiptForm } from "../../types";

export default async function createSalesReceipt(
  transaction: Transaction,
  org: Org,
  userProfile: UserProfile,
  accounts: Account[],
  salesReceiptId: string,
  data: SalesReceiptForm,
  transactionType = "sales receipt"
) {
  const { orgId } = org;
  const { email } = userProfile;
  const { customer, summary, selectedItems, reference, account, paymentMode } =
    data;
  const { customerId } = customer;
  const { accountId } = account;
  const { value: paymentModeId } = paymentMode;
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
    "cashFlow.incoming": increment(totalAmount),
  });

  /**
   * create salesReceipt
   */
  const salesReceiptsCollection = dbCollections(orgId).salesReceipts;
  const salesReceiptRef = doc(salesReceiptsCollection, salesReceiptId);
  // console.log({ salesReceiptData });
  transaction.set(salesReceiptRef, {
    ...tDetails,
    createdBy: email,
    createdAt: serverTimestamp(),
    modifiedBy: email,
    modifiedAt: serverTimestamp(),
  });
}
