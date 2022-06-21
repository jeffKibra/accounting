import { doc, serverTimestamp, increment } from "firebase/firestore";

import { db } from "../firebase";
import {
  getIncomeAccountsMapping,
  getAccountData,
  getAccountsMapping,
} from "../accounts";
import { createSimilarAccountEntries } from "../journals";
import formats from "../formats";
import { getDateDetails } from "../dates";

export default async function createInvoice(
  transaction,
  org = { id: "" },
  userProfile = { email: "" },
  accounts = [{ name: "", accountd: "", accountType: {} }],
  invoiceId = "",
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
    invoiceDate: new Date(),
    dueDate: new Date(),
    paymentTerm: {},
    paymentTermId: "",
  },
  transactionType = "invoice"
) {
  const orgId = org.id;
  const { email } = userProfile;
  const { customerId, customer, summary, selectedItems } = data;
  const { totalAmount, shipping, adjustment, totalTaxes } = summary;
  /**
   * accounts details
   */

  const customerRef = doc(db, "organizations", orgId, "customers", customerId);
  const { yearMonthDay } = getDateDetails();

  // console.log({ selectedItems });

  const tDetails = {
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
    { accountId: "shipping_charge", current: 0, incoming: shipping },
    { accountId: "other_charges", current: 0, incoming: adjustment },
    { accountId: "tax_payable", current: 0, incoming: totalTaxes },
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
  const invoiceRef = doc(db, "organizations", orgId, "invoices", invoiceId);

  // console.log({ tDetails });
  transaction.set(invoiceRef, {
    ...tDetails,
    createdBy: email,
    createdAt: serverTimestamp(),
    modifiedBy: email,
    modifiedAt: serverTimestamp(),
  });
}