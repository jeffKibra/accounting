import {
  updateSimilarAccountEntries,
  getAccountTransactionEntry,
} from "../journals";
import { getAccountData } from "../accounts";
import { fetchInvoiceUpdateData, updateInvoice } from "../invoices";

import { Transaction } from "firebase/firestore";
import {
  Account,
  UserProfile,
  Customer,
  InvoiceFormData,
  Invoice,
} from "../../types";

export default async function updateOB(
  transaction: Transaction,
  orgId: string,
  userProfile: UserProfile,
  accounts: Account[],
  customer: Customer,
  openingBalance: number
) {
  const salesAccount = getAccountData("sales", accounts);
  const OBAAccount = getAccountData("opening_balance_adjustments", accounts);

  const { customerId, paymentTerm } = customer;
  const invoiceId = customerId;

  /**
   * create an invoice equivalent for for customer opening balance
   */
  const invoiceData: InvoiceFormData = {
    summary: {
      totalAmount: openingBalance,
      adjustment: 0,
      shipping: 0,
      subTotal: openingBalance,
      taxType: "",
      taxes: [],
      totalTaxes: 0,
    },
    customer,
    selectedItems: [
      {
        salesAccount,
        salesAccountId: salesAccount.accountId,
        totalAmount: openingBalance,
      },
    ],
    customerNotes: "",
    dueDate: new Date(),
    invoiceDate: new Date(),
    orderNumber: "",
    paymentTerm,
    subject: "",
  };
  /**
   * fetch data
   */
  const [updateData, salesEntry, OBAEntry] = await Promise.all([
    fetchInvoiceUpdateData(transaction, orgId, invoiceId, invoiceData),
    getAccountTransactionEntry(
      orgId,
      salesAccount.accountId,
      customerId,
      "opening balance"
    ),
    getAccountTransactionEntry(
      orgId,
      OBAAccount.accountId,
      customerId,
      "opening balance"
    ),
  ]);
  const { currentInvoice, entriesToDelete, entriesToUpdate, newAccounts } =
    updateData;
  console.log({
    currentInvoice,
    entriesToDelete,
    entriesToUpdate,
    newAccounts,
  });

  const incomingInvoice: Invoice = {
    ...currentInvoice,
    ...invoiceData,
  };
  /**
   * compute adjustment
   */
  const adjustment = +openingBalance - +currentInvoice.summary.totalAmount;
  /**
   * update 2 journal entries
   * 1. debit sales transactionType= opening balance
   * 2. credit opening_balance_adjustments transactionType= opening balance
   */
  /**
   * 1. debit sales
   * to debit income, amount must be negative
   */
  updateSimilarAccountEntries(transaction, userProfile, orgId, salesAccount, [
    {
      amount: 0 - adjustment,
      account: salesEntry.account,
      credit: salesEntry.credit,
      debit: salesEntry.debit,
      entryId: salesEntry.entryId,
    },
  ]);
  /**
   * 2. credit opening_balance_adjustments entry for customer opening balance
   */
  updateSimilarAccountEntries(transaction, userProfile, orgId, OBAAccount, [
    {
      amount: +adjustment,
      account: OBAEntry.account,
      credit: OBAEntry.credit,
      debit: OBAEntry.debit,
      entryId: OBAEntry.entryId,
    },
  ]);
  /**
   * update invoice
   */
  updateInvoice(
    transaction,
    orgId,
    userProfile,
    accounts,
    entriesToUpdate,
    entriesToDelete,
    newAccounts,
    currentInvoice,
    incomingInvoice,
    "customer opening balance"
  );
}
