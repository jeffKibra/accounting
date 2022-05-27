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

import { assetEntry } from "../../../utils/journals";

function* createCustomer({ data }) {
  yield put(start(CREATE_CUSTOMER));

  const orgId = yield select((state) => state.orgsReducer.org.id);
  const userProfile = yield select((state) => state.authReducer.userProfile);
  const { email } = userProfile;
  const { openingBalance } = data;

  console.log({ data });

  async function create() {
    const newDocRef = doc(collection(db, "organizations", orgId, "customers"));
    const countersRef = doc(
      db,
      "organizations",
      orgId,
      "summaries",
      "counters"
    );
    const accountRef = doc(
      db,
      "organizations",
      orgId,
      "accounts",
      "accounts_receivable"
    );

    await runTransaction(db, async (transaction) => {
      const accountDoc = await transaction.get(accountRef);
      if (!accountDoc.exists) {
        throw new Error("Account data not found!");
      }

      const { accountType, name } = accountDoc.data();
      const accountId = accountDoc.id;

      transaction.update(countersRef, {
        customers: increment(1),
      });

      if (openingBalance > 0) {
        assetEntry.newEntry(
          transaction,
          userProfile,
          orgId,
          "accounts_receivable",
          {
            account: { accountType, accountId, name },
            amount: openingBalance,
            reference: "",
            transactionId: newDocRef.id,
            transactionDetails: data,
            transactionType: "customer opening balance",
          }
        );
      }

      transaction.set(newDocRef, {
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
