import { put, call, select, takeLatest } from "redux-saga/effects";
import {
  doc,
  collection,
  serverTimestamp,
  runTransaction,
  increment,
} from "firebase/firestore";

import { liabilityEntry } from "../../../utils/journals";
import {
  getPaymentsTotal,
  getPaymentData,
  getPaymentEntriesToUpdate,
  getPaymentsMapping,
  updateCustomersPayments,
  updateInvoicesPayments,
  payInvoices,
  deleteInvoicesPayments,
  changePaymentAccount,
} from "../../../utils/payments";
import { getAccountData } from "../../../utils/accounts";
import { getInvoiceData } from "../../../utils/invoices";
import { getCustomerData } from "../../../utils/customers";

import { db } from "../../../utils/firebase";
import { UPDATE_PAYMENT } from "../../actions/paymentsActions";
import { start, success, fail } from "../../slices/paymentsSlice";
import {
  error as toastError,
  success as toastSuccess,
} from "../../slices/toastSlice";

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

    async function update() {
      const paymentRef = doc(db, "organizations", orgId, "payments", paymentId);

      await runTransaction(db, async (transaction) => {
        /**
         * get current paymentData and incoming customer details
         */
        const [paymentData, customerData] = await Promise.all([
          getPaymentData(transaction, orgId, paymentId),
          getCustomerData(transaction, orgId, customerId),
        ]);
        /**
         * check if the customer has changed. if yes
         * generate new payment number and slug
         */
        const customerHasChanged = customerId !== paymentData.customerId;

        const paymentNumber = customerHasChanged
          ? (customerData?.summary?.payments || 0) + 1
          : null;
        const paymentSlug = customerHasChanged
          ? `PR-${String(paymentNumber).padStart(6, 0)}`
          : null;
        if (customerHasChanged) {
          console.log({ paymentNumber, paymentSlug });
        }
        /**
         * check if payment account has been changed
         */
        const paymentAccountHasChanged = accountId !== paymentData.accountId;

        const {
          similarPayments,
          paymentsToUpdate,
          paymentsToCreate,
          paymentsToDelete,
        } = getPaymentsMapping(paymentData.payments, payments);
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
            "accounts_received",
            accountsReceivablePaymentsToUpdate
          ),
          getPaymentEntriesToUpdate(
            orgId,
            customerId,
            paidInvoices,
            "accounts_received",
            paymentsToDelete
          ),
        ]);
        /**
         * start docs writing!
         */
        const transactionDetails = {
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
        console.log({ transactionDetails });

        /**
         * update customers
         */
        updateCustomersPayments(
          transaction,
          orgId,
          userProfile,
          paymentData,
          data
        );
        /**
         * update invoices
         */
        /**
         * update accounts receivable entries
         * they are not factored in if deposit account has changed
         */
        updateInvoicesPayments(
          transaction,
          userProfile,
          orgId,
          paymentData,
          transactionDetails,
          accountsReceivableEntries
        );
        /**
         * check is paymentAccountId has changed
         */
        if (paymentAccountHasChanged) {
          //create new payment entries for the new account
          changePaymentAccount(transaction, userProfile, orgId);
        } else {
          //update payment entries
          updateInvoicesPayments(
            transaction,
            userProfile,
            orgId,
            paymentData,
            transactionDetails,
            paymentAccountEntries
          );
        }
        /**
         * create new invoice payments
         */
        payInvoices(
          transaction,
          userProfile,
          orgId,
          transactionDetails,
          accounts
        );
        /**
         * delete deleted invoices
         */
        deleteInvoicesPayments(
          transaction,
          userProfile,
          orgId,
          paymentData,
          paymentAccountEntriesToDelete
        );
        deleteInvoicesPayments(
          transaction,
          userProfile,
          orgId,
          paymentData,
          accountsReceivableEntriesToDelete
        );

        /**
         * excess amount - credit account with the excess amount
         */
        if (excess > 0) {
          liabilityEntry.newEntry(
            transaction,
            userProfile,
            orgId,
            unearned_revenue.accountId,
            {
              amount: excess,
              reference,
              account: unearned_revenue,
              transactionId: paymentSlug,
              transactionType: "customer payment",
              transactionDetails,
            }
          );
        }

        /**
         * update payment
         */
        const { paymentId: pid, ...tDetails } = transactionDetails;
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
