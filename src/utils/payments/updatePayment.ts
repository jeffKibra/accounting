import {
  doc,
  increment,
  serverTimestamp,
  Transaction,
} from "firebase/firestore";

import {
  deleteSimilarAccountEntries,
  updateSimilarAccountEntries,
  changeEntriesAccount,
} from "../journals";
import {
  getPaymentsTotal,
  getPaymentData,
  getPaymentEntriesToUpdate,
  getPaymentsMapping,
  updateCustomersPayments,
  updateInvoicesPayments,
  payInvoices,
  deleteInvoicesPayments,
  overPay,
  getPaymentEntry,
  combineInvoices,
} from ".";
import { getAccountData } from "../accounts";
import {
  createDailySummary,
  changePaymentMode,
  updatePaymentMode,
} from "../summaries";
import formats from "../formats";
import { getDateDetails } from "../dates";

import { db } from "../firebase";

import {
  UserProfile,
  Account,
  PaymentReceived,
  PaymentReceivedForm,
} from "../../types";

export default async function updatePayment(
  transaction: Transaction,
  orgId: string,
  userProfile: UserProfile,
  accounts: Account[],
  paymentId: string,
  formData: PaymentReceivedForm
) {
  const { email } = userProfile;
  console.log({ formData });
  const {
    payments,
    paidInvoices,
    amount,
    account,
    reference,
    paymentMode,
    customer,
  } = formData;
  const { accountId } = account;
  const { customerId } = customer;
  const { value: paymentModeId } = paymentMode;
  /**
   * get payments total
   */
  const paymentsTotal = getPaymentsTotal(payments);
  if (paymentsTotal > amount) {
    throw new Error("Invoices payments cannot be more than customer payment!");
  }
  /**
   * compute excess amount if any
   */
  const excess = amount - paymentsTotal;

  //accounts data
  const unearned_revenue = getAccountData("unearned_revenue", accounts);
  const accounts_receivable = getAccountData("accounts_receivable", accounts);
  const depositAccount = getAccountData(accountId, accounts);

  /**
   * get current currentPayment and incoming customer details
   * create daily summary since all updates also update the summary
   */
  const [currentPayment] = await Promise.all([
    getPaymentData(transaction, orgId, paymentId),
    createDailySummary(orgId),
  ]);
  const {
    customer: { customerId: currentCustomerId },
    account: { accountId: currentAccountId },
    paymentMode: { name: currentPaymentModeId },
    amount: currentAmount,
  } = currentPayment;
  /**
   * check if the customer has changed. if yes
   * generate new payment number and slug
   */
  const customerHasChanged = customerId !== currentCustomerId;

  const allInvoices = combineInvoices(
    [...currentPayment.paidInvoices],
    [...paidInvoices]
  );

  if (customerHasChanged) {
    console.log("customer has changed");
  }
  /**
   * check if payment account has been changed
   */
  const paymentAccountHasChanged = accountId !== currentAccountId;

  const {
    similarPayments,
    paymentsToUpdate,
    paymentsToCreate,
    paymentsToDelete,
  } = getPaymentsMapping(currentPayment.payments, payments);
  // console.log({
  //   similarPayments,
  //   paymentsToUpdate,
  //   paymentsToCreate,
  //   paymentsToDelete,
  // });
  /**
   * create two different update values based on the accounts:
   * 1. accountsReceivable account
   * 2. deposit account
   * if either customer or deposit account has changed:
   * values include paymentsToUpdate and similarPayments
   * else, paymentsToUpdate only
   */
  const accountsReceivablePaymentsToUpdate = customerHasChanged
    ? [...paymentsToUpdate, ...similarPayments]
    : paymentsToUpdate;
  const accountPaymentsToUpdate =
    customerHasChanged || paymentAccountHasChanged
      ? [...paymentsToUpdate, ...similarPayments]
      : paymentsToUpdate;
  /**
   * divide the payments entries into:
   * 1. accounts_receivable account
   * 2. selected paymentAccount
   * get entries for each payments that needs updating
   */
  const [
    paymentAccountEntries,
    paymentAccountEntriesToDelete,
    accountsReceivableEntries,
    accountsReceivableEntriesToDelete,
    overPayEntry,
  ] = await Promise.all([
    getPaymentEntriesToUpdate(
      orgId,
      paymentId,
      [...allInvoices],
      currentAccountId, //use current payment accountId
      [...accountPaymentsToUpdate]
    ),
    getPaymentEntriesToUpdate(
      orgId,
      paymentId,
      [...allInvoices],
      currentAccountId,
      [...paymentsToDelete]
    ),
    getPaymentEntriesToUpdate(
      orgId,
      paymentId,
      [...allInvoices],
      accounts_receivable.accountId,
      [...accountsReceivablePaymentsToUpdate]
    ),
    getPaymentEntriesToUpdate(
      orgId,
      paymentId,
      [...allInvoices],
      accounts_receivable.accountId,
      [...paymentsToDelete]
    ),
    getPaymentEntry(orgId, paymentId, unearned_revenue.accountId, paymentId),
  ]);

  // console.log({
  //   paymentAccountEntries,
  //   paymentAccountEntriesToDelete,
  //   accountsReceivableEntries,
  //   accountsReceivableEntriesToDelete,
  //   overPayEntry,
  // });
  /**
   * start docs writing!
   */
  const transactionDetails: PaymentReceived = {
    ...formData,
    paidInvoicesIds: paidInvoices.map((invoice) => invoice.invoiceId),
    excess,
    paymentId,
    customer: formats.formatCustomerData(customer),
    paidInvoices: formats.formatInvoices(paidInvoices),
  };
  // console.log({ transactionDetails });
  const newDetails = {
    ...transactionDetails,
    modifiedBy: email,
    modifiedAt: serverTimestamp(),
  };
  /**
   * update customers
   * function also handles a change of customer situation.
   */
  updateCustomersPayments(
    transaction,
    orgId,
    userProfile,
    currentPayment,
    formData
  );
  /**
   * update invoices
   * 1. update the necessary invoice payments
   * 2. updates accountsReceivableEntries for the updated payments
   * 3. updates paymentAccount entries fro the same
   */
  updateInvoicesPayments(transaction, userProfile, orgId, paymentId, [
    ...paymentsToUpdate,
  ]);
  /**2
   * update accounts receivable entries
   * they are not factored in if deposit account has changed
   * NOTE:::pass income as a negative value to be credited
   */
  updateSimilarAccountEntries(
    transaction,
    userProfile,
    orgId,
    accounts_receivable,
    accountsReceivableEntries.map((entry) => {
      if (!entry.entry) {
        throw new Error("Entry data not found");
      }
      const {
        incoming,
        entry: { credit, debit, entryId },
        invoice,
      } = entry;

      return {
        account: accounts_receivable,
        amount: 0 - incoming,
        credit,
        debit,
        entryId,
        transactionId: invoice.invoiceId,
        transactionDetails: { ...transactionDetails },
      };
    })
  );
  /**3
   * check is paymentAccountId has changed
   */
  if (paymentAccountHasChanged) {
    /**
     * change the entries details and update associated accounts
     */
    console.log("account has changed");
    changeEntriesAccount(
      transaction,
      userProfile,
      orgId,
      currentPayment.account,
      depositAccount,
      paymentAccountEntries.map((entry) => {
        if (!entry.entry) {
          throw new Error("Entry data not found");
        }
        const { invoice, incoming } = entry;
        return {
          amount: incoming,
          prevAccount: currentPayment.account,
          prevEntry: entry.entry,
          transactionDetails: { ...transactionDetails },
          transactionId: invoice.invoiceId,
          transactionType: "customer payment",
          reference,
        };
      })
    );
  } else {
    /**
     * do a normal update
     */
    console.log("normal update");
    updateSimilarAccountEntries(
      transaction,
      userProfile,
      orgId,
      depositAccount,
      paymentAccountEntries.map((entry) => {
        if (!entry.entry) {
          throw new Error("Entry data not found");
        }
        const {
          entry: { credit, debit, entryId },
          incoming,
          invoice,
        } = entry;
        return {
          account: depositAccount,
          amount: incoming,
          credit,
          debit,
          entryId,
          transactionId: invoice.invoiceId,
          transactionDetails: { ...transactionDetails },
        };
      })
    );
  }
  /**
   * create new invoice payments if any
   * the function also creates all the necessary journal entries
   */
  if (paymentsToCreate.length > 0) {
    console.log("creating payments");
    payInvoices(
      transaction,
      userProfile,
      orgId,
      transactionDetails,
      paymentsToCreate,
      accounts
    );
  }
  /**
   * delete deleted payments
   * 1. delete payments in invoices
   * 2. delete paymentAccount entries
   * 3. delete accountsReceivable entries
   */
  if (paymentsToDelete.length > 0) {
    console.log("deleting payments");
    deleteInvoicesPayments(
      transaction,
      userProfile,
      orgId,
      currentPayment,
      paymentsToDelete
    );
  }
  if (paymentAccountEntriesToDelete.length > 0) {
    console.log("deleting deposit account entries");

    deleteSimilarAccountEntries(
      transaction,
      userProfile,
      orgId,
      currentPayment.account,
      paymentAccountEntriesToDelete.map((entry) => {
        if (!entry.entry) {
          throw new Error("Entry data not found");
        }
        const {
          entry: { credit, debit, entryId },
        } = entry;
        return {
          account: currentPayment.account,
          credit,
          debit,
          entryId,
        };
      })
    );
  }
  if (accountsReceivableEntriesToDelete.length > 0) {
    console.log("deleting accounts_receivebale entries");

    deleteSimilarAccountEntries(
      transaction,
      userProfile,
      orgId,
      accounts_receivable,
      accountsReceivableEntriesToDelete.map((entry) => {
        if (!entry.entry) {
          throw new Error("Entry data not found");
        }
        const {
          entry: { credit, debit, entryId },
        } = entry;
        return {
          account: accounts_receivable,
          credit,
          debit,
          entryId,
        };
      })
    );
  }
  /**
   * excess amount - credit account with the excess amount
   */
  if (overPayEntry) {
    console.log("updating overpayment");

    overPay.updateEntry(
      transaction,
      userProfile,
      orgId,
      excess,
      transactionDetails,
      overPayEntry,
      accounts
    );
  } else {
    if (excess > 0) {
      console.log("creating overpayment");

      overPay.createEntry(
        transaction,
        userProfile,
        orgId,
        excess,
        transactionDetails,
        accounts
      );
    }
  }
  /**
   * update summary payment modes
   * if mode has changed, change the mode values
   */
  if (currentPaymentModeId === paymentModeId) {
    if (currentPayment.amount !== amount) {
      /**
       * create adjustment by subtracting current amount from incoming amount
       */
      const modeAdjustment = amount - currentPayment.amount;
      updatePaymentMode(transaction, orgId, paymentModeId, modeAdjustment);
    }
  } else {
    /**
     * payment modes are not the same
     */
    changePaymentMode(
      transaction,
      orgId,
      { amount: currentAmount, paymentModeId: currentPaymentModeId },
      { amount, paymentModeId }
    );
  }
  /**
   * update summary
   */
  if (currentPayment.amount !== amount) {
    const { yearMonthDay } = getDateDetails();
    const summaryRef = doc(
      db,
      "organizations",
      orgId,
      "summaries",
      yearMonthDay
    );
    const adjustment = +amount - +currentPayment.amount;
    transaction.update(summaryRef, {
      "cashFlow.incoming": increment(adjustment),
    });
  }

  /**
   * update payment
   */
  const { paymentId: pid, ...tDetails } = newDetails;
  // console.log({ tDetails });
  const paymentRef = doc(db, "organizations", orgId, "payments", paymentId);
  transaction.update(paymentRef, { ...tDetails });
}
