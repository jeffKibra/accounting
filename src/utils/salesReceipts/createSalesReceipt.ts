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
import { formatSalesItems } from "../sales";

import {
  UserProfile,
  Org,
  Account,
  SalesReceiptForm,
  TransactionTypes,
} from "../../types";

export default async function createSalesReceipt(
  transaction: Transaction,
  org: Org,
  userProfile: UserProfile,
  accounts: Account[],
  salesReceiptId: string,
  data: SalesReceiptForm,
  transactionType: keyof Pick<
    TransactionTypes,
    "sales_receipt"
  > = "sales_receipt"
) {
  const { orgId } = org;
  const { email } = userProfile;
  const { customer, summary, selectedItems, reference, account, paymentMode } =
    data;
  const { customerId } = customer;
  const { accountId } = account;
  const { value: paymentModeId } = paymentMode;
  const { totalTaxes, adjustment, shipping, totalAmount } = summary;
  console.log({ data });

  // console.log({ selectedItems });
  const tDetails = {
    ...data,
    status: "active",
    isSent: false,
    transactionType,
    org: formats.formatOrgData(org),
    customer: formats.formatCustomerData(customer),
    selectedItems: selectedItems,
  };
  const transactionDetails = {
    ...tDetails,
    salesReceiptId,
  };
  const transactionId = salesReceiptId;

  /**
   * create journal entries for income accounts
   */
  const allItems = [
    ...formatSalesItems(selectedItems),
    { accountId: "shipping_charge", amount: shipping },
    { accountId: "other_charges", amount: adjustment },
    { accountId: "tax_payable", amount: totalTaxes },
    { accountId, amount: totalAmount },
  ];
  const { newAccounts } = getAccountsMapping([], allItems);

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
