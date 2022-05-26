import { put, call, select, takeLatest } from "redux-saga/effects";
import {
  doc,
  collection,
  serverTimestamp,
  runTransaction,
  increment,
} from "firebase/firestore";

import { assetEntry, liabilityEntry } from "../journals";
import {
  getPaymentsTotal,
  getPaymentData,
  getPaymentEntriesToUpdate,
  getPaymentsMapping,
  updateCustomersPayments,
  updateInvoicesPayment,
  createInvoicesPayment,
  deleteInvoicesPayment,
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
    const allAccounts = yield select((state) => state.accountsReducer.accounts);
    // console.log({ data, orgId, userProfile });
    const {
      paymentId,
      payments,
      invoices,
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
    const unearned_revenue = getAccountData("unearned_revenue", allAccounts);

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
         * if customer has changed, updates include:
         * paymentsToUpdate && similaPayments
         * else, paymentsToUpdate
         */
        const updates =
          customerHasChanged || paymentAccountHasChanged
            ? [...paymentsToUpdate, ...similarPayments]
            : paymentsToUpdate;

        //get entries for each payments that needs updating
        const paymentEntriesToUpdate = await getPaymentEntriesToUpdate(
          orgId,
          paymentData,
          updates
        );
        //get entries for payments to be deleted
        const paymentEntriesToDelete = await getPaymentEntriesToUpdate(
          orgId,
          paymentData,
          paymentsToDelete
        );

        /**
         * start docs writing!
         */

        const transactionDetails = {
          ...data,
          paymentId,
          invoices,
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
         * check is paymentAccountId has changed
         */
        if (paymentAccountHasChanged) {
          //delete payment entries for previous
          deleteInvoicesPayment(
            transaction,
            userProfile,
            orgId,
            paymentData,
            paymentEntriesToDelete
          );
          //create new payment entries for the new account
          createInvoicesPayment(
            transaction,
            userProfile,
            orgId,
            paymentData,
            paymentsToCreate
          );
        } else {
          //update payment entries
          updateInvoicesPayment(
            transaction,
            userProfile,
            orgId,
            paymentData,
            transactionDetails,
            paymentEntriesToUpdate
          );
        }

        //excess amount - credit account with the excess amount
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

        //create new payment
        const { paymentId: pid, ...tDetails } = transactionDetails;
        transaction.update(paymentRef, { ...tDetails }, { merge: true });
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
