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

  // console.log({ data });

  async function create() {
    const newDocRef = doc(collection(db, "organizations", orgId, "customers"));
    const customerId = newDocRef.id;
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
        customerId,
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
      const { openingBalance } = transactionDetails;

      transaction.update(countersRef, {
        customers: increment(1),
      });

      /**
       * create accounts receivable entry for customer opening balance
       */
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
            amount: openingBalance,
            account: accounts_receivable,
            reference: "",
            transactionDetails,
            transactionId: customerId,
            transactionType: "customer opening balance",
          },
        ]
      );
      /**
       * create opening_balance_adjustments entry for customer opening balance
       */
      const obAdjustments = getAccountData(
        "opening_balance_adjustments",
        accounts
      );
      createSimilarAccountEntries(
        transaction,
        userProfile,
        orgId,
        obAdjustments,
        [
          {
            amount: +openingBalance,
            account: obAdjustments,
            reference: "",
            transactionDetails,
            transactionId: customerId,
            transactionType: "opening balance",
          },
        ]
      );
      /**
       * create customer
       */
      const { customerId: cid, ...tDetails } = transactionDetails;
      transaction.set(newDocRef, {
        ...tDetails,
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
