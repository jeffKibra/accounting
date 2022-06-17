import { doc, serverTimestamp, increment } from "firebase/firestore";

import { db } from "../firebase";
import { createSimilarAccountEntries } from "../journals";
import { getAccountData } from "../accounts";
import { getDateDetails } from "../dates";
import { createDailySummary } from "../summaries";
import { createInvoice } from "../invoices";

export default async function createCustomer(
  transaction,
  org = { id: "" },
  userProfile = { email: "" },
  accounts,
  customerId,
  customerData = {
    firstName: "",
    lastName: "",
    salutation: "",
    companyName: "",
    type: "",
    email: "",
    mobile: "",
    phone: "",
    openingBalance: 0,
    paymentTermId: "",
    paymentTerm: {},
    website: "",
    remarks: "",
    billingCity: "",
    billingCountry: "",
    billingPostalCode: "",
    billingState: "",
    billingStreet: "",
    shippingCity: "",
    shippingCountry: "",
    shippingPostalCode: "",
    shippingState: "",
    shippingStreet: "",
  }
) {
  const orgId = org.id;
  const { email } = userProfile;
  const customerRef = doc(db, "organizations", orgId, "customers", customerId);
  const { yearMonthDay } = getDateDetails();
  const summaryRef = doc(db, "organizations", orgId, "summaries", yearMonthDay);
  /**
   * create daily summary data
   */
  await createDailySummary(orgId);

  const { openingBalance, paymentTermId, paymentTerm } = customerData;

  const transactionDetails = {
    ...customerData,
    customerId,
    status: "active",
    summary: {
      invoices: 0,
      deletedInvoices: 0,
      payments: 0,
      deletedPayments: 0,
      unusedCredits: 0,
      invoicedAmount: openingBalance,
      invoicePayments: 0,
    },
  };

  transaction.update(summaryRef, {
    customers: increment(1),
  });
  /**
   * if opening balance is greater than zero
   * create journal entries and an equivalent invoice
   */
  if (openingBalance > 0) {
    /**
     * create 2 journal entries
     * 1. debit sales accountType= opening balance
     * 2. credit opening_balance_adjustments accountType= opening balance
     */
    /**
     * 1. debit sales
     * to debit income, amount must be negative
     */
    const sales = getAccountData("sales", accounts);
    createSimilarAccountEntries(transaction, userProfile, orgId, sales, [
      {
        amount: 0 - openingBalance,
        account: sales,
        reference: "",
        transactionDetails,
        transactionId: customerId,
        transactionType: "opening balance",
      },
    ]);
    /**
     * 2. credit opening_balance_adjustments entry for customer opening balance
     */
    const obAdjustments = getAccountData(
      "opening_balance_adjustments",
      accounts
    );
    createSimilarAccountEntries(
      transaction,
      userProfile,
      orgId,
      obAdjustments,
      [
        {
          amount: +openingBalance,
          account: obAdjustments,
          reference: "",
          transactionDetails,
          transactionId: customerId,
          transactionType: "opening balance",
        },
      ]
    );
    /**
     * create an invoice equivalent for for customer opening balance
     */
    const salesAccount = getAccountData("sales", accounts);
    await createInvoice(
      transaction,
      org,
      userProfile,
      accounts,
      "customer opening balance",
      {
        customerId,
        customer: transactionDetails,
        invoiceDate: serverTimestamp(),
        dueDate: serverTimestamp(),
        paymentTerm,
        paymentTermId,
        summary: {
          shipping: 0,
          adjustment: 0,
          subTotal: 0,
          totalTaxes: 0,
          totalAmount: openingBalance,
        },
        selectedItems: [
          {
            salesAccount,
            salesAccountId: salesAccount.accountId,
            totalAmount: openingBalance,
          },
        ],
      },
      "customer opening balance"
    );
  }
  /**
   * create customer
   */
  const { customerId: cid, ...tDetails } = transactionDetails;
  transaction.set(customerRef, {
    ...tDetails,
    createdBy: email,
    createdAt: serverTimestamp(),
    modifiedBy: email,
    modifiedAt: serverTimestamp(),
  });
}
