import { put, call, select, takeLatest } from "redux-saga/effects";
import { doc, serverTimestamp, runTransaction } from "firebase/firestore";

import {
  getCustomerEntryData,
  deleteSimilarAccountEntries,
  updateSimilarAccountEntries,
  changeEntriesAccount,
} from "../../../utils/journals";
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
} from "../../../utils/payments";
import { getAccountData } from "../../../utils/accounts";
import { getCustomerData } from "../../../utils/customers";

import { db } from "../../../utils/firebase";
import { UPDATE_PAYMENT } from "../../actions/paymentsActions";
import { start, success, fail } from "../../slices/paymentsSlice";
import {
  error as toastError,
  success as toastSuccess,
} from "../../slices/toastSlice";
import formats from "../../../utils/formats";

function* updatePayment({ data }) {
  yield put(start(UPDATE_PAYMENT));

  try {
    const org = yield select((state) => state.orgsReducer.org);
    const orgId = org.id;
    const userProfile = yield select((state) => state.authReducer.userProfile);
    const { email } = userProfile;
    const accounts = yield select((state) => state.accountsReducer.accounts);
    // console.log({ data, orgId, userProfile });
    const {
      paymentId,
      payments,
      paidInvoices,
      customerId,
      amount,
      accountId,
      reference,
    } = data;
    console.log({ payments });

    Object.keys(payments).forEach((key) => {
      const value = payments[key];
      if (value === 0) {
        delete payments[key];
      }
    });
    console.log({ payments });

    // const invoicesIds = Object.keys(payments);
    const paymentsTotal = getPaymentsTotal(payments);

    if (paymentsTotal > amount) {
      throw new Error(
        "Invoices payments cannot be more than customer payment!"
      );
    }
    const excess = amount - paymentsTotal;
    console.log({ paymentsTotal, excess });

    //accounts data
    const unearned_revenue = getAccountData("unearned_revenue", accounts);
    const accounts_receivable = getAccountData("accounts_receivable", accounts);
    const depositAccount = getAccountData(accountId, accounts);

    async function update() {
      const paymentRef = doc(db, "organizations", orgId, "payments", paymentId);

      await runTransaction(db, async (transaction) => {
        /**
         * get current currentPayment and incoming customer details
         */
        const [currentPayment, customerData] = await Promise.all([
          getPaymentData(transaction, orgId, paymentId),
          getCustomerData(transaction, orgId, customerId),
        ]);
        /**
         * check if the customer has changed. if yes
         * generate new payment number and slug
         */
        const customerHasChanged = customerId !== currentPayment.customerId;

        const paymentNumber = customerHasChanged
          ? (customerData?.summary?.payments || 0) + 1
          : null;
        const paymentSlug = customerHasChanged
          ? `PR-${String(paymentNumber).padStart(6, 0)}`
          : null;
        console.log({ paymentNumber, paymentSlug });

        if (customerHasChanged) {
          console.log("customer has changed");
        }
        /**
         * check if payment account has been changed
         */
        const paymentAccountHasChanged = accountId !== currentPayment.accountId;

        const {
          similarPayments,
          paymentsToUpdate,
          paymentsToCreate,
          paymentsToDelete,
        } = getPaymentsMapping(currentPayment.payments, payments);
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
            customerId,
            paidInvoices,
            accountId,
            accountPaymentsToUpdate
          ),
          getPaymentEntriesToUpdate(
            orgId,
            customerId,
            paidInvoices,
            accountId,
            paymentsToDelete
          ),
          getPaymentEntriesToUpdate(
            orgId,
            customerId,
            paidInvoices,
            accounts_receivable.accountId,
            accountsReceivablePaymentsToUpdate
          ),
          getPaymentEntriesToUpdate(
            orgId,
            customerId,
            paidInvoices,
            accounts_receivable.accountId,
            paymentsToDelete
          ),
          getCustomerEntryData(
            orgId,
            customerId,
            unearned_revenue.accountId,
            currentPayment.paymentSlug,
            "customer payment"
          ),
        ]);

        /**
         * start docs writing!
         */
        const newDetails = {
          ...data,
          paymentId,
          modifiedBy: email,
          modifiedAt: serverTimestamp(),
          ...(customerHasChanged
            ? {
                status: "active",
                paymentNumber,
                paymentSlug,
                createdBy: email,
                createdAt: serverTimestamp(),
              }
            : {}),
        };
        const transactionDetails = formats.formatTransactionDetails(newDetails);

        console.log({ newDetails, transactionDetails });
        /**
         * update customers
         * function also handles a change of customer situation.
         */
        updateCustomersPayments(
          transaction,
          orgId,
          userProfile,
          currentPayment,
          data
        );
        /**
         * update invoices
         * 1. update the necessary invoice payments
         * 2. updates accountsReceivableEntries for the updated payments
         * 3. updates paymentAccount entries fro the same
         */
        updateInvoicesPayments(
          transaction,
          userProfile,
          orgId,
          transactionDetails,
          paymentsToUpdate
        );
        /**2
         * update accounts receivable entries
         * they are not factored in if deposit account has changed
         */
        updateSimilarAccountEntries(
          transaction,
          userProfile,
          orgId,
          accounts_receivable,
          accountsReceivableEntries.map((entry) => {
            const {
              entry: { credit, debit, entryId },
            } = entry;
            return {
              account: accounts_receivable,
              amount,
              credit,
              debit,
              entryId,
              transactionDetails,
              ...(customerHasChanged ? { transactionId: paymentSlug } : {}),
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
          console.log("account has changed", {
            depositAccount,
            prev: currentPayment.account,
          });
          changeEntriesAccount(
            transaction,
            userProfile,
            orgId,
            currentPayment.account,
            depositAccount,
            paymentAccountEntries.map((entry) => {
              return {
                amount,
                prevAccount: currentPayment.account,
                prevEntry: entry.entry,
                transactionDetails,
                reference,
                ...(customerHasChanged ? { transactionId: paymentSlug } : {}),
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
              const {
                entry: { credit, debit, entryId },
              } = entry;
              return {
                account: depositAccount,
                amount,
                credit,
                debit,
                entryId,
                transactionDetails,
                ...(customerHasChanged ? { transactionId: paymentSlug } : {}),
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
          console.log("deleting i");
          deleteInvoicesPayments(
            transaction,
            userProfile,
            orgId,
            currentPayment,
            paymentsToDelete
          );
        }
        if (paymentAccountEntriesToDelete.length > 0) {
          console.log("deleting j");

          deleteSimilarAccountEntries(
            transaction,
            userProfile,
            orgId,
            currentPayment.account,
            paymentAccountEntriesToDelete.map((entry) => {
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
          console.log("deleting k");

          deleteSimilarAccountEntries(
            transaction,
            userProfile,
            orgId,
            currentPayment.account,
            accountsReceivableEntriesToDelete.map((entry) => {
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
        /**
         * excess amount - credit account with the excess amount
         */
        if (overPayEntry) {
          console.log("overpayment i");

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
            console.log("overpayment j");

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
         * update payment
         */
        const { paymentId: pid, org, ...tDetails } = transactionDetails;
        console.log({ tDetails });
        transaction.update(paymentRef, { ...tDetails });
      });
    }

    yield call(update);

    yield put(success());
    yield put(toastSuccess("Payment sucessfully created!"));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchUpdatePayment() {
  yield takeLatest(UPDATE_PAYMENT, updatePayment);
}
