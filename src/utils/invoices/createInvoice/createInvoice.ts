import {
  doc,
  serverTimestamp,
  increment,
  Transaction,
} from "firebase/firestore";

import { db, dbCollections } from "../../firebase";
import {
  getIncomeAccountsMapping,
  getAccountData,
  getAccountsMapping,
} from "../../accounts";
import { createSimilarAccountEntries } from "../../journals";
import formats from "../../formats";
import { getDateDetails } from "../../dates";

/**
 *
 * @typedef {import('.').invoice} invoice
 */
/**
 *
 * @typedef {import('../accounts').account} account
 */

/**
 *
 * @param {*} transaction
 * @param {Object} org
 * @param {{email:''}} userProfile
 * @param {account[]} accounts
 * @param {string} invoiceId
 * @param {invoice} data
 * @param {string} transactionType
 */

import {
  Org,
  UserProfile,
  Account,
  InvoiceFormData,
  InvoiceFromDb,
} from "../../../types";

interface TDetails
  extends Omit<
    InvoiceFromDb,
    "createdAt" | "createdBy" | "modifiedAt" | "modifiedBy"
  > {}

export default function createInvoice(
  transaction: Transaction,
  org: Org,
  userProfile: UserProfile,
  accounts: Account[],
  invoiceId: string,
  data: InvoiceFormData,
  transactionType: string = "invoice"
) {
  const { orgId } = org;
  const { email } = userProfile;
  const { customer, summary, selectedItems } = data;
  const { totalAmount, shipping, adjustment, totalTaxes } = summary;
  const { customerId } = customer;
  /**
   * accounts details
   */
  const { yearMonthDay } = getDateDetails();

  // console.log({ selectedItems });

  const tDetails: TDetails = {
    ...data,
    balance: summary.totalAmount,
    payments: {},
    paymentsIds: [],
    paymentsCount: 0,
    status: "active",
    isSent: false,
    transactionType,
    org: formats.formatOrgData(org),
    customer: formats.formatCustomerData(customer),
    selectedItems: formats.formatSaleItems(selectedItems),
  };
  const transactionDetails = {
    ...tDetails,
    invoiceId,
  };
  const transactionId = invoiceId;
  const reference = "";

  /**
   * create journal entries for income accounts
   */
  let { newAccounts } = getIncomeAccountsMapping([], selectedItems);
  const summaryAccounts = getAccountsMapping([
    { accountId: "shipping_charge", current: 0, incoming: shipping || 0 },
    { accountId: "other_charges", current: 0, incoming: adjustment || 0 },
    { accountId: "tax_payable", current: 0, incoming: totalTaxes || 0 },
    { accountId: "accounts_receivable", current: 0, incoming: totalAmount },
  ]);
  newAccounts = [...newAccounts, ...summaryAccounts.newAccounts];
  /**
   * create all accounts
   */
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
   * since an invoice is also created for customer opening balances
   * use the isInvoice tag to check whether to create:
   * -customer summary and
   * -org summary
   */
  if (transactionType === "invoice") {
    /**
     * update customer summaries
     */
    const customersCollections = dbCollections(orgId).customers;
    const customerRef = doc(customersCollections, customerId);

    transaction.update(customerRef, {
      "summary.invoices": increment(1),
      "summary.invoicedAmount": increment(totalAmount),
    });
    /**
     * update org summaries
     */
    const summaryRef = doc(
      db,
      "organizations",
      orgId,
      "summaries",
      yearMonthDay
    );
    transaction.update(summaryRef, {
      invoices: increment(1),
    });
  }
  /**
   * create invoice
   */
  const invoicesCollection = dbCollections(orgId).invoices;
  const invoiceRef = doc(invoicesCollection, invoiceId);

  // console.log({ tDetails });
  transaction.set(invoiceRef, {
    ...tDetails,
    createdBy: email,
    createdAt: serverTimestamp(),
    modifiedBy: email,
    modifiedAt: serverTimestamp(),
  });
}
