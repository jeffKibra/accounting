import { put, call, select, takeLatest } from "redux-saga/effects";
import {
  doc,
  collection,
  serverTimestamp,
  runTransaction,
  increment,
} from "firebase/firestore";

import { db } from "../../../utils/firebase";

import { CREATE_CUSTOMER } from "../../actions/customersActions";
import { start, success, fail } from "../../slices/customersSlice";
import {
  success as toastSuccess,
  error as toastError,
} from "../../slices/toastSlice";

import { createSimilarAccountEntries } from "../../../utils/journals";
import { getAccountData } from "../../../utils/accounts";

function* createCustomer({ data }) {
  yield put(start(CREATE_CUSTOMER));

  const orgId = yield select((state) => state.orgsReducer.org.id);
  const userProfile = yield select((state) => state.authReducer.userProfile);
  const { email } = userProfile;
  const accounts = yield select((state) => state.accountsReducer.accounts);

  const { openingBalance } = data;

  // console.log({ data });

  async function create() {
    const newDocRef = doc(collection(db, "organizations", orgId, "customers"));
    const countersRef = doc(
      db,
      "organizations",
      orgId,
      "summaries",
      "counters"
    );

    await runTransaction(db, async (transaction) => {
      const transactionDetails = {
        ...data,
        status: "active",
        summary: {
          invoices: 0,
          deletedInvoices: 0,
          payments: 0,
          deletedPayments: 0,
          unusedCredits: 0,
          invoicedAmount: 0,
          invoicePayments: 0,
        },
      };

      transaction.update(countersRef, {
        customers: increment(1),
      });

      const accounts_receivable = getAccountData(
        "accounts_receivable",
        accounts
      );
      createSimilarAccountEntries(
        transaction,
        userProfile,
        orgId,
        accounts_receivable,
        [
          {
            amount: +openingBalance,
            account: accounts_receivable,
            reference: "",
            transactionDetails,
            transactionId: newDocRef.id,
            transactionType: "customer opening balance",
          },
        ]
      );

      transaction.set(newDocRef, {
        ...transactionDetails,
        createdBy: email,
        createdAt: serverTimestamp(),
        modifiedBy: email,
        modifiedAt: serverTimestamp(),
      });
    });
  }

  try {
    yield call(create);

    yield put(success());
    yield put(toastSuccess("Customer added successfully!"));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchCreateCustomer() {
  yield takeLatest(CREATE_CUSTOMER, createCustomer);
}
