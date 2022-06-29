import { doc, serverTimestamp, increment } from "firebase/firestore";

import { db } from "../firebase";
import { getDateDetails } from "../dates";
import { createOB } from ".";

/**
 *
 * @typedef {Object} customer
 * @property {string} displayName
 * @property {Object} paymentTerm
 * @property {number} openingBalance
 * @property {string} type
 */

/**
 *
 * @param {*} transaction
 * @param {Object} org
 * @param {{email:""}} userProfile
 * @param {{}[]} accounts
 * @param {string} customerId
 * @param {customer} customerData
 */

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

  const { openingBalance } = customerData;

  const customer = {
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

  /**
   * if opening balance is greater than zero
   * create journal entries and an equivalent invoice
   */
  if (openingBalance > 0) {
    /**
     * create opening balance
     */
    createOB(transaction, org, userProfile, accounts, customer, openingBalance);
  }
  /**
   * update org summary
   */
  const { yearMonthDay } = getDateDetails();
  const summaryRef = doc(db, "organizations", orgId, "summaries", yearMonthDay);
  transaction.update(summaryRef, {
    customers: increment(1),
  });
  /**
   * create customer
   */
  const { customerId: cid, ...tDetails } = customer;
  transaction.set(customerRef, {
    ...tDetails,
    createdBy: email,
    createdAt: serverTimestamp(),
    modifiedBy: email,
    modifiedAt: serverTimestamp(),
  });
}
