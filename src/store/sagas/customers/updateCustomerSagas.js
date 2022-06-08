import { put, call, select, takeLatest } from "redux-saga/effects";
import {
  doc,
  serverTimestamp,
  increment,
  runTransaction,
} from "firebase/firestore";

import { db } from "../../../utils/firebase";
import {
  updateSimilarAccountEntries,
  createSimilarAccountEntries,
  deleteSimilarAccountEntries,
} from "../../../utils/journals";
import {
  getCustomerData,
  getOpeningBalanceEntry,
} from "../../../utils/customers";
import { getAccountData } from "../../../utils/accounts";

import {
  UPDATE_CUSTOMER,
  DELETE_CUSTOMER,
} from "../../actions/customersActions";
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
  const accounts = yield select((state) => state.accountsReducer.accounts);

  const { customerId, ...rest } = data;

  async function update() {
    const customerRef = doc(
      db,
      "organizations",
      orgId,
      "customers",
      customerId
    );
    const accounts_receivable = getAccountData("accounts_receivable", accounts);

    await runTransaction(db, async (transaction) => {
      const [customerData, openingBalanceEntry] = await Promise.all([
        getCustomerData(transaction, orgId, customerId),
        getOpeningBalanceEntry(
          orgId,
          customerId,
          accounts_receivable.accountId
        ),
      ]);

      //incoming opening balance
      const newOpeningBalance = rest.openingBalance;
      //current opening balance
      const { openingBalance } = customerData;

      const transactionDetails = {
        ...data,
      };

      if (openingBalance !== newOpeningBalance) {
        if (openingBalanceEntry) {
          const { credit, debit, entryId } = openingBalanceEntry;
          /**
           * opening balance has changed
           * update the entry
           */
          updateSimilarAccountEntries(
            transaction,
            userProfile,
            orgId,
            accounts_receivable,
            [
              {
                amount: newOpeningBalance,
                account: accounts_receivable,
                credit,
                debit,
                entryId,
                transactionDetails,
              },
            ]
          );
        } else {
          createSimilarAccountEntries(
            transaction,
            userProfile,
            orgId,
            accounts_receivable,
            [
              {
                amount: newOpeningBalance,
                account: accounts_receivable,
                reference: "",
                transactionDetails,
                transactionId: customerId,
                transactionType: "customer opening balance",
              },
            ]
          );
        }
      }

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

function* deleteCustomer({ customerId }) {
  yield put(start(DELETE_CUSTOMER));

  const orgId = yield select((state) => state.orgsReducer.org.id);
  const userProfile = yield select((state) => state.authReducer.userProfile);
  const { email } = userProfile;
  const accounts = yield select((state) => state.accountsReducer.accounts);

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

    const accounts_receivable = getAccountData("accounts_receivable", accounts);

    await runTransaction(db, async (transaction) => {
      const [openingBalanceEntry] = await Promise.all([
        getOpeningBalanceEntry(
          orgId,
          customerId,
          accounts_receivable.accountId
        ),
      ]);

      if (openingBalanceEntry) {
        const { credit, debit, entryId } = openingBalanceEntry;

        deleteSimilarAccountEntries(
          transaction,
          userProfile,
          orgId,
          accounts_receivable,
          [
            {
              account: accounts_receivable,
              credit,
              debit,
              entryId,
            },
          ]
        );
      }

      transaction.update(countersRef, {
        customers: increment(-1),
      });

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
