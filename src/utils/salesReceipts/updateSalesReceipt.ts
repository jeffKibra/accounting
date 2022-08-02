import {
  doc,
  serverTimestamp,
  increment,
  Transaction,
} from "firebase/firestore";

import { db, dbCollections } from "../firebase";
import {
  updateSimilarAccountEntries,
  deleteSimilarAccountEntries,
  createSimilarAccountEntries,
  changeEntriesAccount,
  getAccountsEntriesForTransaction,
  getAccountEntryForTransaction,
} from "../journals";

import { getAccountData, getAccountsMapping } from "../accounts";
import { changePaymentMode, updatePaymentMode } from "../summaries";
import { getSalesReceiptData } from ".";
import { getDateDetails } from "../dates";
import { formatSalesItems } from "../sales";

import { SalesReceiptForm, UserProfile, Account } from "../../types";

export default async function updateSalesReceipt(
  transaction: Transaction,
  orgId: string,
  userProfile: UserProfile,
  accounts: Account[],
  salesReceiptId: string,
  data: SalesReceiptForm
) {
  console.log({ data });
  const { email } = userProfile;
  const { summary, selectedItems, customer, account, paymentMode, reference } =
    data;
  const { customerId } = customer;
  const { accountId } = account;
  const { value: paymentModeId } = paymentMode;
  // console.log({ data });
  const { totalTax, shipping, adjustment, totalAmount } = summary;

  const [currentSalesReceipt] = await Promise.all([
    getSalesReceiptData(transaction, orgId, salesReceiptId),
  ]);

  const {
    customer: { customerId: currentCustomerId },
    account: { accountId: currentAccountId },
    paymentMode: { value: currentPaymentModeId },
    summary: currentSummary,
  } = currentSalesReceipt;
  /**
   * check if customer has been changed
   */
  const currentItems = [
    ...formatSalesItems(currentSalesReceipt.selectedItems),
    {
      amount: currentSummary.shipping,
      accountId: "shipping_charge",
    },
    {
      amount: currentSummary.adjustment,
      accountId: "other_charges",
    },
    {
      amount: currentSummary.totalTax,
      accountId: "tax_payable",
    },
  ];
  const incomingItems = [
    ...formatSalesItems(selectedItems),
    {
      amount: shipping,
      accountId: "shipping_charge",
    },
    {
      amount: adjustment,
      accountId: "other_charges",
    },
    {
      amount: totalTax,
      accountId: "tax_payable",
    },
  ];

  const customerHasChanged = currentCustomerId !== customerId;

  let { deletedAccounts, newAccounts, updatedAccounts, similarAccounts } =
    getAccountsMapping(currentItems, incomingItems);

  const accountsToUpdate = [...similarAccounts, ...updatedAccounts];
  /**
   * get entries data for deletedAccounts and accountsToUpdate
   */
  const [entriesToUpdate, entriesToDelete, paymentAccountEntry] =
    await Promise.all([
      getAccountsEntriesForTransaction(
        orgId,
        salesReceiptId,
        "sales_receipt",
        accountsToUpdate
      ),
      getAccountsEntriesForTransaction(
        orgId,
        salesReceiptId,
        "sales_receipt",
        deletedAccounts
      ),
      getAccountEntryForTransaction(
        orgId,
        currentAccountId,
        salesReceiptId,
        "sales_receipt"
      ),
    ]);
  const paymentAccountEntries = [paymentAccountEntry];
  //currentSummary

  const transactionDetails = {
    ...data,
    salesReceiptId,
  };
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
        transactionId: salesReceiptId,
        transactionType: "sales_receipt",
      },
    ]);
  });

  /**
   * update deposit account
   * check if the account was changed and update accordingly
   */
  const depositAccount = getAccountData(accountId, accounts);
  /**
   * check if payment account has changed
   */
  const paymentAccountHasChanged = accountId !== currentAccountId;

  if (paymentAccountHasChanged) {
    /**
     * change the entries details and update associated accounts
     */
    console.log("account has changed");
    changeEntriesAccount(
      transaction,
      userProfile,
      orgId,
      currentSalesReceipt.account,
      depositAccount,
      paymentAccountEntries.map((entry) => {
        const { account } = entry;
        return {
          amount: totalAmount,
          prevAccount: account,
          prevEntry: entry,
          transactionDetails: { ...transactionDetails },
          reference,
        };
      })
    );
  } else {
    /**
     * do a normal update
     */
    if (totalAmount !== currentSummary.totalAmount || customerHasChanged) {
      console.log("normal update");
      updateSimilarAccountEntries(
        transaction,
        userProfile,
        orgId,
        depositAccount,
        paymentAccountEntries.map((entry) => {
          const { entryId, credit, debit, account } = entry;
          return {
            amount: totalAmount,
            account,
            credit,
            debit,
            entryId,
            transactionDetails,
          };
        })
      );
    }
  }
  /**
   * update summary payment modes
   * if mode has changed, change the mode values
   */
  if (currentPaymentModeId === paymentModeId) {
    if (currentSummary.totalAmount !== totalAmount) {
      /**
       * create adjustment by subtracting current amount from incoming amount
       */
      const modeAdjustment = totalAmount - currentSummary.totalAmount;
      updatePaymentMode(transaction, orgId, paymentModeId, modeAdjustment);
    }
  } else {
    /**
     * payment modes are not the same
     */
    changePaymentMode(
      transaction,
      orgId,
      {
        amount: currentSummary.totalAmount,
        paymentModeId: currentPaymentModeId,
      },
      { amount: totalAmount, paymentModeId }
    );
  }
  /**
   * update customer summaries
   */
  const newCustomerRef = customerId
    ? doc(db, "organizations", orgId, "customers", customerId)
    : null;
  const currentCustomerRef = currentCustomerId
    ? doc(db, "organizations", orgId, "customers", currentCustomerId)
    : null;
  /**
   * opening balance is strictly tied to a customer.
   * cant change hence no need to change anything
   */
  if (customerHasChanged) {
    //delete values from previous customer
    if (currentCustomerRef) {
      transaction.update(currentCustomerRef, {
        "summary.salesReceiptsAmount": increment(
          0 - currentSummary.totalAmount
        ),
        "summary.deletedSalesReceipts": increment(1),
      });
    }
    if (newCustomerRef) {
      //add new values to the incoming customer
      transaction.update(newCustomerRef, {
        "summary.salesReceiptsAmount": increment(totalAmount),
        "summary.salesReceipts": increment(1),
      });
    }
  } else {
    if (currentCustomerRef) {
      if (currentSummary.totalAmount !== totalAmount) {
        const adjustment = totalAmount - currentSummary.totalAmount;
        //update customer summaries
        transaction.update(currentCustomerRef, {
          "summary.salesReceiptsAmount": increment(adjustment),
        });
      }
    }
  }
  /**
   * update summaries
   */
  if (currentSummary.totalAmount !== totalAmount) {
    const { yearMonthDay } = getDateDetails();
    const summaryRef = doc(
      db,
      "organizations",
      orgId,
      "summaries",
      yearMonthDay
    );
    const cashAdjustment = totalAmount - currentSummary.totalAmount;
    transaction.update(summaryRef, {
      "cashFlow.incoming": increment(cashAdjustment),
    });
  }

  /**
   * update sales receipt
   */
  const salesReceiptsCollection = dbCollections(orgId).salesReceipts;
  const salesReceiptRef = doc(salesReceiptsCollection, salesReceiptId);
  // console.log({ tDetails });
  transaction.update(salesReceiptRef, {
    ...data,
    // classical: "plus",
    modifiedBy: email,
    modifiedAt: serverTimestamp(),
  });
}
