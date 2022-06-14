import {
  doc,
  collection,
  serverTimestamp,
  increment,
} from "firebase/firestore";

import { db } from "../firebase";
import { createInvoiceSlug, getIncomeAccountsMapping } from "../invoices";

import { createSimilarAccountEntries } from "../journals";
import { getAccountData } from "../accounts";
import { getCustomerData } from "../customers";
import formats from "../formats";
import { getDateDetails } from "../dates";

export default async function createInvoice(
  transaction,
  org = { id: "" },
  userProfile = { email: "" },
  accounts = [{ name: "", accountd: "", accountType: {} }],
  data = {
    customerId: "",
    summary: { totalAmount: 0 },
    selectedItems: [
      {
        salesAccount: { name: "", accountd: "", accountType: {} },
        totalAmount: 0,
      },
    ],
  },
  isInvoice = true
) {
  const orgId = org.id;
  const { email } = userProfile;
  const { customerId, summary, selectedItems } = data;
  /**
   * accounts details
   */
  const accounts_receivable = getAccountData("accounts_receivable", accounts);
  const tax_payable = getAccountData("tax_payable", accounts);
  const shipping_charge = getAccountData("shipping_charge", accounts);
  const other_charges = getAccountData("other_charges", accounts);

  const customerRef = doc(db, "organizations", orgId, "customers", customerId);
  const { yearMonthDay } = getDateDetails();
  const summaryRef = doc(db, "organizations", orgId, "summaries", yearMonthDay);

  const newDocRef = doc(collection(db, "organizations", orgId, "invoices"));
  const invoiceId = newDocRef.id;

  const [customer, invoiceSlug] = await Promise.all([
    getCustomerData(transaction, orgId, customerId),
    createInvoiceSlug(transaction, orgId),
  ]);
  // console.log({ selectedItems });

  const invoiceData = {
    ...data,
    balance: summary.totalAmount,
    payments: {},
    paymentsIds: [],
    paymentsCount: 0,
    status: "active",
    isSent: false,
    invoiceSlug,
    org: formats.formatOrgData(org),
    customer: formats.formatCustomerData(customer),
    selectedItems: formats.formatInvoiceItems(selectedItems),
  };

  const transactionDetails = { ...invoiceData, invoiceId };
  const transactionType = "invoice";
  const transactionId = invoiceSlug;
  const reference = "";

  /**
   * create journal entries for income accounts
   */
  const { newAccounts } = getIncomeAccountsMapping([], selectedItems);

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
  // console.log({ summary });
  /**
   * journal entry for invoice total => accounts_receivable
   */
  createSimilarAccountEntries(
    transaction,
    userProfile,
    orgId,
    accounts_receivable,
    [
      {
        amount: summary.totalAmount,
        account: accounts_receivable,
        reference,
        transactionId,
        transactionType,
        transactionDetails,
      },
    ]
  );
  /**
   * since an invoice is also created for customer opening balances
   * use the isInvoice tag to check whether to create taxes, shipping and adjustments
   */
  if (isInvoice) {
    /**
     * journal entry for taxes => tax_payable-liability account
     */
    createSimilarAccountEntries(transaction, userProfile, orgId, tax_payable, [
      {
        amount: summary.totalTaxes,
        account: tax_payable,
        reference,
        transactionId,
        transactionType,
        transactionDetails,
      },
    ]);
    /**
     * shipping charge
     */
    createSimilarAccountEntries(
      transaction,
      userProfile,
      orgId,
      shipping_charge,
      [
        {
          amount: summary.shipping,
          account: shipping_charge,
          reference,
          transactionId,
          transactionType,
          transactionDetails,
        },
      ]
    );
    /**
     * adjustments
     */
    createSimilarAccountEntries(
      transaction,
      userProfile,
      orgId,
      other_charges,
      [
        {
          amount: summary.adjustment,
          account: other_charges,
          reference,
          transactionDetails,
          transactionId,
          transactionType,
        },
      ]
    );
  }

  /**
   * update customer summaries
   */
  transaction.update(customerRef, {
    "summary.invoices": increment(1),
    "summary.invoicedAmount": increment(summary.totalAmount),
  });
  /**
   * update org summaries
   */
  transaction.update(summaryRef, {
    invoices: increment(1),
  });
  /**
   * create invoice
   */
  transaction.set(newDocRef, {
    ...invoiceData,
    createdBy: email,
    createdAt: serverTimestamp(),
    modifiedBy: email,
    modifiedAt: serverTimestamp(),
  });
}
