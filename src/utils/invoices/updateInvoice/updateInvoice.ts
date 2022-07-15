import {
  doc,
  serverTimestamp,
  increment,
  Transaction,
  Timestamp,
} from "firebase/firestore";

import { dbCollections } from "../../firebase";
import {
  updateSimilarAccountEntries,
  deleteSimilarAccountEntries,
  createSimilarAccountEntries,
} from "../../journals";
import { getAccountData } from "../../accounts";

import {
  UserProfile,
  Account,
  Invoice,
  AccountMapping,
  MappedEntry,
  InvoiceFromDb,
} from "../../../types";

export default function updateInvoice(
  transaction: Transaction,
  orgId: string,
  userProfile: UserProfile,
  accounts: Account[],
  entriesToUpdate: MappedEntry[],
  entriesToDelete: MappedEntry[],
  newAccounts: AccountMapping[],
  currentInvoice: Invoice,
  incomingInvoice: Invoice,
  transactionType: string = "invoice"
) {
  const { email } = userProfile;
  const { invoiceId, ...invoiceData } = incomingInvoice;
  const {
    summary: { totalAmount },
    customer,
  } = invoiceData;
  const { customerId } = customer;
  const {
    summary: { totalAmount: currentTotal },
    customer: { customerId: currentCustomerId },
  } = currentInvoice;

  // console.log({ data });

  /**
   * formulate data
   */

  const transactionDetails = {
    ...invoiceData,
    invoiceId,
  };
  const transactionId = invoiceId;
  /**
   * start writing
   */

  /**
   * update entries
   */
  entriesToUpdate.forEach((entry) => {
    const { accountId, incoming, credit, debit, entryId } = entry;
    const entryAccount = getAccountData(accountId, accounts);

    updateSimilarAccountEntries(transaction, userProfile, orgId, entryAccount, [
      {
        amount: incoming,
        account: entryAccount,
        credit,
        debit,
        entryId,
        transactionDetails,
        transactionId,
      },
    ]);
  });
  /**
   * delete deleted income accounts
   */
  entriesToDelete.forEach((entry) => {
    const { accountId, credit, debit, entryId } = entry;
    const entryAccount = getAccountData(accountId, accounts);

    deleteSimilarAccountEntries(transaction, userProfile, orgId, entryAccount, [
      {
        account: entryAccount,
        credit,
        debit,
        entryId,
      },
    ]);
  });
  /**
   * create new entries for new income accounts
   */
  newAccounts.forEach((incomeAccount) => {
    const { accountId, incoming } = incomeAccount;
    const entryAccount = getAccountData(accountId, accounts);

    createSimilarAccountEntries(transaction, userProfile, orgId, entryAccount, [
      {
        amount: incoming,
        account: entryAccount,
        reference: "",
        transactionDetails,
        transactionId,
        transactionType: "invoice",
      },
    ]);
  });
  /**
   * update customer summaries
   * only allowed where transactionType is invoice
   */

  if (transactionType === "invoice") {
    const customersCollection = dbCollections(orgId).customers;
    const newCustomerRef = doc(customersCollection, customerId);
    const currentCustomerRef = doc(customersCollection, currentCustomerId);
    /**
     * check if customer has been changed
     */
    const customerHasChanged = currentCustomerId !== customerId;

    if (customerHasChanged) {
      //delete values from previous customer
      transaction.update(currentCustomerRef, {
        "summary.invoicedAmount": increment(0 - currentTotal),
        "summary.deletedInvoices": increment(1),
      });
      //add new values to the incoming customer
      transaction.update(newCustomerRef, {
        "summary.invoicedAmount": increment(totalAmount),
        "summary.invoices": increment(1),
      });
    } else {
      if (currentTotal !== totalAmount) {
        const adjustment = totalAmount - currentTotal;
        //update customer summaries
        transaction.update(currentCustomerRef, {
          "summary.invoicedAmount": increment(adjustment),
        });
      }
    }
  }
  /**
   * calculate balance adjustment
   */
  const balanceAdjustment = totalAmount - currentTotal;
  /**
   * update invoice
   */
  const invoicesCollection = dbCollections(orgId).invoices;
  const invoiceRef = doc(invoicesCollection, invoiceId);
  console.log({ invoiceData });

  const invoice: InvoiceFromDb = {
    ...invoiceData,
    balance: increment(balanceAdjustment) as unknown as number,
    modifiedBy: email,
    modifiedAt: serverTimestamp() as Timestamp,
  };

  transaction.update(invoiceRef, {
    ...invoice,
  });
}
