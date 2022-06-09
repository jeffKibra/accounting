import { put, call, select, takeLatest } from "redux-saga/effects";
import {
  doc,
  serverTimestamp,
  increment,
  runTransaction,
} from "firebase/firestore";

import { db } from "../../../utils/firebase";
import { deleteSimilarAccountEntries } from "../../../utils/journals";
import { getCustomerEntry } from "../../../utils/customers";

import { DELETE_CUSTOMER } from "../../actions/customersActions";
import { start, success, fail } from "../../slices/customersSlice";
import {
  success as toastSuccess,
  error as toastError,
} from "../../slices/toastSlice";

function* deleteCustomer({ customerId }) {
  yield put(start(DELETE_CUSTOMER));

  const orgId = yield select((state) => state.orgsReducer.org.id);
  const userProfile = yield select((state) => state.authReducer.userProfile);
  const { email } = userProfile;

  async function update() {
    const customerRef = doc(
      db,
      "organizations",
      orgId,
      "customers",
      customerId
    );
    const countersRef = doc(
      db,
      "organizations",
      orgId,
      "summaries",
      "counters"
    );

    await runTransaction(db, async (transaction) => {
      const [arEntry, obaEntry] = await Promise.all([
        getCustomerEntry(
          orgId,
          customerId,
          "accounts_receivable",
          "customer opening balance"
        ),
        getCustomerEntry(
          orgId,
          customerId,
          "opening_balance_adjustments",
          "opening balance"
        ),
      ]);

      /**
       * delete opening balance entry for accounts_receivable
       */
      deleteSimilarAccountEntries(
        transaction,
        userProfile,
        orgId,
        arEntry.account,
        [
          {
            account: arEntry.account,
            credit: arEntry.credit,
            debit: arEntry.debit,
            entryId: arEntry.entryId,
          },
        ]
      );
      /**
       * delete opening balance entry for opening_balance_adjustments
       */
      deleteSimilarAccountEntries(
        transaction,
        userProfile,
        orgId,
        obaEntry.account,
        [
          {
            account: obaEntry.account,
            credit: obaEntry.credit,
            debit: obaEntry.debit,
            entryId: obaEntry.entryId,
          },
        ]
      );
      /**
       * update counters for one deleted customer
       */
      transaction.update(countersRef, {
        customers: increment(-1),
      });
      /**
       * mark customer as deleted
       */
      transaction.update(customerRef, {
        status: "deleted",
        modifiedBy: email,
        modifiedAt: serverTimestamp(),
      });
    });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess("Customer Deleted successfully!"));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchDeleteCustomer() {
  yield takeLatest(DELETE_CUSTOMER, deleteCustomer);
}
