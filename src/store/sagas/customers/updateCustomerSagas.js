import { put, call, select, takeLatest } from "redux-saga/effects";
import { doc, serverTimestamp, runTransaction } from "firebase/firestore";

import { db } from "../../../utils/firebase";

import { getCustomerData, getCustomerEntry } from "../../../utils/customers";
import { updateSimilarAccountEntries } from "../../../utils/journals";

import { UPDATE_CUSTOMER } from "../../actions/customersActions";
import { start, success, fail } from "../../slices/customersSlice";
import {
  success as toastSuccess,
  error as toastError,
} from "../../slices/toastSlice";

function* updateCustomer({ data }) {
  yield put(start(UPDATE_CUSTOMER));

  const orgId = yield select((state) => state.orgsReducer.org.id);
  const userProfile = yield select((state) => state.authReducer.userProfile);
  const { email } = userProfile;

  const { customerId, ...rest } = data;

  async function update() {
    const customerRef = doc(
      db,
      "organizations",
      orgId,
      "customers",
      customerId
    );

    await runTransaction(db, async (transaction) => {
      const [customerData, arEntry, obaEntry] = await Promise.all([
        getCustomerData(transaction, orgId, customerId),
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
       * incoming opening balance
       */
      const newOpeningBalance = rest.openingBalance;
      /**
       * current opening balance
       */
      const { openingBalance } = customerData;
      /**
       * check if opening balance has changed
       */
      if (openingBalance !== newOpeningBalance) {
        /**
         * opening balance has changed
         * update opening balance entries
         */
        /**
         * update accounts_receivable entry
         */
        updateSimilarAccountEntries(
          transaction,
          userProfile,
          orgId,
          arEntry.account,
          [
            {
              amount: +newOpeningBalance,
              account: arEntry.account,
              credit: arEntry.credit,
              debit: arEntry.debit,
              entryId: arEntry.entryId,
            },
          ]
        );
        /**
         * update opening_balance_adjustments entry
         */
        updateSimilarAccountEntries(
          transaction,
          userProfile,
          orgId,
          obaEntry.account,
          [
            {
              amount: +newOpeningBalance,
              account: obaEntry.account,
              credit: obaEntry.credit,
              debit: obaEntry.debit,
              entryId: obaEntry.entryId,
            },
          ]
        );
      }
      /**
       * update customer data
       */
      transaction.update(customerRef, {
        ...rest,
        modifiedBy: email,
        modifiedAt: serverTimestamp(),
      });
    });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess("Customer UPDATED successfully!"));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchUpdateCustomer() {
  yield takeLatest(UPDATE_CUSTOMER, updateCustomer);
}
