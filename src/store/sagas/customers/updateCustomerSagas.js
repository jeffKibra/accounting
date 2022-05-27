import { put, call, select, takeLatest } from "redux-saga/effects";
import {
  doc,
  serverTimestamp,
  writeBatch,
  increment,
  runTransaction,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

import { db } from "../../../utils/firebase";
import { assetEntry } from "../../../utils/journals";

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
  const { customerId, ...rest } = data;

  const accountId = "accounts_receivable";

  async function update() {
    const q = query(
      collection(db, "organizations", orgId, "journals"),
      orderBy("createdAt", "desc"),
      where("transactionId", "==", customerId),
      where("account.accountId", "==", accountId),
      where("transactionType", "==", "customer opening balance"),
      where("status", "==", "active"),
      limit(1)
    );
    const obSnap = await getDocs(q);

    const customerRef = doc(
      db,
      "organizations",
      orgId,
      "customers",
      customerId
    );
    const accountRef = doc(db, "organizations", orgId, "accounts", accountId);

    await runTransaction(db, async (transaction) => {
      const [customerDoc, accountDoc] = await Promise.all([
        transaction.get(customerRef),
        transaction.get(accountRef),
      ]);

      if (!customerDoc.exists) {
        throw new Error("Customer data not found!");
      }
      if (!accountDoc.exists) {
        throw new Error("Account data not found!");
      }

      const customerData = customerDoc.data();
      //incoming opening balance
      const newOpeningBalance = rest.openingBalance;
      //current opening balance
      const { openingBalance } = customerData;

      //account data
      const { accountType, name } = accountDoc.data();

      if (openingBalance !== newOpeningBalance) {
        //opening balance has changed
        //check if new value is zero(0)... delete entry if is zero
        if (obSnap.empty) {
          //no journal entry found, create new entry
          if (openingBalance === 0) {
            //create new journal entry
            assetEntry.newEntry(transaction, userProfile, orgId, accountId, {
              transactionType: "customer opening balance",
              transactionId: customerDoc.id,
              reference: "",
              transactionDetails: customerData,
              amount: newOpeningBalance,
              account: { accountId, accountType, name },
            });
          }
        } else {
          const obDoc = obSnap.docs[0];
          const entryId = obDoc.id;
          const { credit, debit } = obDoc.data();

          if (newOpeningBalance === 0) {
            assetEntry.deleteEntry(
              transaction,
              userProfile,
              orgId,
              entryId,
              accountId,
              { debit, credit }
            );
          } else {
            assetEntry.updateEntry(
              transaction,
              userProfile,
              orgId,
              accountId,
              entryId,
              newOpeningBalance,
              {
                credit,
                debit,
              }
            );
          }
        }
      }

      console.log({ rest });

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

    const batch = writeBatch(db);

    batch.update(countersRef, {
      customers: increment(-1),
    });

    batch.update(customerRef, {
      status: "deleted",
      modifiedBy: email,
      modifiedAt: serverTimestamp(),
    });

    await batch.commit();
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
