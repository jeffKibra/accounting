import { put, call, select, takeLatest } from "redux-saga/effects";
import {
  doc,
  serverTimestamp,
  runTransaction,
  increment,
} from "firebase/firestore";

import {
  deleteSimilarAccountEntries,
  groupEntriesIntoAccounts,
} from "../../../utils/journals";
import {
  getPaymentsTotal,
  getPaymentData,
  getPaymentsMapping,
  deleteInvoicesPayments,
  getAllPaymentEntries,
} from "../../../utils/payments";

import { db } from "../../../utils/firebase";
import { DELETE_PAYMENT } from "../../actions/paymentsActions";
import { start, success, fail } from "../../slices/paymentsSlice";
import {
  error as toastError,
  success as toastSuccess,
} from "../../slices/toastSlice";

function* deletePayment({ paymentId }) {
  yield put(start(DELETE_PAYMENT));

  try {
    const org = yield select((state) => state.orgsReducer.org);
    const orgId = org.id;
    const userProfile = yield select((state) => state.authReducer.userProfile);
    const { email } = userProfile;
    // console.log({ paymentId });

    // const invoicesIds = Object.keys(payments);

    async function update() {
      const paymentRef = doc(db, "organizations", orgId, "payments", paymentId);

      const countersRef = doc(
        db,
        "organizations",
        orgId,
        "summaries",
        "counters"
      );

      await runTransaction(db, async (transaction) => {
        /**
         * get current paymentData and incoming customer details
         */
        const [paymentData, allEntries] = await Promise.all([
          getPaymentData(transaction, orgId, paymentId),
          getAllPaymentEntries(orgId, paymentId),
        ]);
        const { customerId, payments, excess } = paymentData;
        const paymentsTotal = getPaymentsTotal(payments);
        // console.log({ allEntries });
        /**
         * group entries into accounts
         */
        const groupedEntries = groupEntriesIntoAccounts(allEntries);
        // console.log({ groupedEntries });

        const { paymentsToDelete } = getPaymentsMapping(payments, {});
        // console.log({
        //   paymentsToDelete,
        // });

        /**
         * start docs writing!
         */

        /**
         * delete entries
         */
        groupedEntries.forEach((group) => {
          const { entries, ...account } = group;

          deleteSimilarAccountEntries(
            transaction,
            userProfile,
            orgId,
            account,
            entries
          );
        });

        /**
         * delete deleted payments from linked invoices
         */
        if (paymentsToDelete.length > 0) {
          // console.log("deleting i");
          deleteInvoicesPayments(
            transaction,
            userProfile,
            orgId,
            paymentData,
            paymentsToDelete
          );
        }
        /**
         * update customers
         * function also handles a change of customer situation.
         */
        const customerRef = doc(
          db,
          "organizations",
          orgId,
          "customers",
          customerId
        );
        transaction.update(customerRef, {
          "summary.deletedPayments": increment(1),
          "summary.unusedCredits": increment(0 - excess),
          "summary.invoicePayments": increment(0 - paymentsTotal),
          modifiedAt: serverTimestamp(),
          modifiedBy: email,
        });
        /**
         * update orgs counters
         */
        transaction.update(countersRef, {
          deletedPayments: increment(1),
        });
        /**
         * mark payment as deleted
         */
        transaction.update(paymentRef, {
          status: "deleted",
          modifiedAt: serverTimestamp(),
          modifiedBy: email,
        });
      });
    }

    yield call(update);

    yield put(success());
    yield put(toastSuccess("Payment sucessfully deleted!"));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchDeletePayment() {
  yield takeLatest(DELETE_PAYMENT, deletePayment);
}
