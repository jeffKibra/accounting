import {
  collection,
  limit,
  where,
  getDocs,
  serverTimestamp,
  query,
  getDoc,
  doc,
  writeBatch,
} from "firebase/firestore";
import { put, call, takeLatest, select } from "redux-saga/effects";

import { db } from "../../../utils/firebase";
import {
  accounts,
  accountTypes,
  paymentTerms,
  paymentModes,
} from "../../../constants";

import { start, success, fail } from "../../slices/orgsSlice";
import { CREATE_ORG } from "../../actions/orgsActions";
import {
  success as toastSuccess,
  error as toastError,
} from "../../slices/toastSlice";

export function getOrg(userId) {
  // console.log("getting org", userId);

  const q = query(
    collection(db, "organizations"),
    where("owner", "==", userId),
    where("status", "in", ["onboarding", "active", "suspended"]),
    limit(1)
  );

  return getDocs(q).then((snap) => {
    if (snap.empty) {
      return null;
    }

    const orgDoc = snap.docs[0];

    return {
      ...orgDoc.data(),
      orgId: orgDoc.id,
      id: orgDoc.id,
    };
  });
}

function* createOrg({ data }) {
  yield put(start(CREATE_ORG));
  // console.log({ data });

  const userProfile = yield select((state) => state.authReducer.userProfile);
  const { email, user_id } = userProfile;

  async function saveData() {
    const orgRef = doc(collection(db, "organizations"));
    const countersRef = doc(db, orgRef.path, "summaries", "counters");
    const accountTypesRef = doc(db, orgRef.path, "orgDetails", "accountTypes");
    const paymentModesRef = doc(db, orgRef.path, "orgDetails", "paymentModes");
    const paymentTermsRef = doc(db, orgRef.path, "orgDetails", "paymentTerms");

    const batch = writeBatch(db);

    Object.keys(accounts).forEach((key) => {
      const accountDetails = accounts[key];
      const accountRef = doc(db, orgRef.path, "accounts", key);

      batch.set(accountRef, {
        ...accountDetails,
        status: "active",
        createdAt: serverTimestamp(),
        createdBy: email,
        modifiedAt: serverTimestamp(),
        modifiedBy: email,
      });
    });

    batch.set(accountTypesRef, {
      accountTypes,
      createdAt: serverTimestamp(),
      createdBy: email,
      modifiedAt: serverTimestamp(),
      modifiedBy: email,
    });

    batch.set(paymentModesRef, {
      paymentModes,
      createdAt: serverTimestamp(),
      createdBy: email,
      modifiedAt: serverTimestamp(),
      modifiedBy: email,
    });

    batch.set(paymentTermsRef, {
      paymentTerms,
      createdAt: serverTimestamp(),
      createdBy: email,
      modifiedAt: serverTimestamp(),
      modifiedBy: email,
    });

    batch.set(countersRef, {
      invoices: 0,
      deletedInvoices: 0,
      payments: 0,
      deletedPayments: 0,
      items: 0,
      customers: 0,
    });

    batch.set(orgRef, {
      ...data,
      status: "active",
      createdBy: email,
      modifiedBy: email,
      owner: user_id,
      createdAt: serverTimestamp(),
      modifiedAt: serverTimestamp(),
    });

    await batch.commit();

    const orgDoc = await getDoc(orgRef);

    return {
      ...orgDoc.data(),
      orgId: orgDoc.id,
      id: orgDoc.id,
    };
  }

  try {
    const userHasOrg = yield call(getOrg, user_id);

    if (userHasOrg) {
      throw new Error("This User already has a Company account!");
    }

    const org = yield call(saveData);
    // console.log({ org });

    yield put(success(org));
    yield put(toastSuccess("Campany successfully created!"));
  } catch (err) {
    console.log(err);
    yield put(fail(err));
    yield put(toastError(err.message));
  }
}

export function* watchCreateOrg() {
  yield takeLatest(CREATE_ORG, createOrg);
}
