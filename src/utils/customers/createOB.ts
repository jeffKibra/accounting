import { Transaction } from "firebase/firestore";

import { createSimilarAccountEntries } from "../journals";
import { getAccountData } from "../accounts";
import { createInvoice } from "../invoices";

/**
 *
 * @typedef {import('.').customer} customer
 * @typedef {import('../accounts').account} account
 * @typedef {import('firebase/firestore').Transaction} transaction
 */
/**
 *
 * @param {transaction} transaction
 * @param {{id:''}} org
 * @param {{email:''}} userProfile
 * @param {account[]} accounts
 * @param {customer} customer
 * @param {number} openingBalance
 */

import { Org, UserProfile, Account, CustomerFormDataWithId } from "../../types";

export default function createOB(
  transaction: Transaction,
  org: Org,
  userProfile: UserProfile,
  accounts: Account[],
  customer: CustomerFormDataWithId,
  openingBalance: number
) {
  const orgId = org.id;
  const { paymentTermId, paymentTerm, customerId } = customer;
  /**
   * create transaction details for journal entries
   */
  const transactionDetails = {
    ...customer,
    status: "active",
  };
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
  const obAdjustments = getAccountData("opening_balance_adjustments", accounts);
  createSimilarAccountEntries(transaction, userProfile, orgId, obAdjustments, [
    {
      amount: +openingBalance,
      account: obAdjustments,
      reference: "",
      transactionDetails,
      transactionId: customerId,
      transactionType: "opening balance",
    },
  ]);
  /**
   * create an invoice equivalent for for customer opening balance
   */
  const invoiceId = customerId;
  const salesAccount = getAccountData("sales", accounts);
  createInvoice(
    transaction,
    org,
    userProfile,
    accounts,
    invoiceId,
    {
      customerId,
      customer: transactionDetails,
      invoiceDate: new Date(),
      dueDate: new Date(),
      paymentTerm,
      paymentTermId,
      summary: {
        totalAmount: openingBalance,
        adjustment: 0,
        shipping: 0,
        subTotal: openingBalance,
        taxType: "",
        taxes: [],
        totalTaxes: 0,
      },
      selectedItems: [
        {
          salesAccount,
          salesAccountId: salesAccount.accountId,
          totalAmount: openingBalance,
        },
      ],
      customerNotes: "",
      subject: "",
      orderNumber: "",
    },
    "customer opening balance"
  );
}
