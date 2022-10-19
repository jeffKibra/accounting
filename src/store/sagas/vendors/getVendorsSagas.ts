import { put, call, select, takeLatest } from "redux-saga/effects";
import {
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { PayloadAction } from "@reduxjs/toolkit";

import { dbCollections } from "../../../utils/firebase";

import { GET_VENDORS, GET_VENDOR } from "../../actions/vendorsActions";
import {
  start,
  vendorSuccess,
  vendorsSuccess,
  fail,
} from "../../slices/vendorsSlice";
import { error as toastError } from "../../slices/toastSlice";

import { RootState, Vendor } from "../../../types";

function* getVendors() {
  yield put(start(GET_VENDORS));

  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  async function get() {
    const vendorsCollection = dbCollections(orgId).vendors;
    const q = query(
      vendorsCollection,
      orderBy("createdAt", "desc"),
      where("status", "==", 0)
    );
    const snap = await getDocs(q);

    const vendors = snap.docs.map((vendorDoc) => {
      return {
        ...vendorDoc.data(),
        vendorId: vendorDoc.id,
      };
    });

    return vendors;
  }

  try {
    const vendors: Vendor[] = yield call(get);

    yield put(vendorsSuccess(vendors));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetVendors() {
  yield takeLatest(GET_VENDORS, getVendors);
}

function* getVendor(action: PayloadAction<string>) {
  yield put(start(GET_VENDOR));
  const vendorId = action.payload;
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  async function get() {
    const vendorsCollection = dbCollections(orgId).vendors;
    const vendorDoc = await getDoc(doc(vendorsCollection, vendorId));
    const vendorData = vendorDoc.data();

    if (!vendorDoc.exists || !vendorData) {
      throw new Error("Vendor not found!");
    }

    return {
      ...vendorDoc.data(),
      vendorId,
    };
  }

  try {
    const vendor: Vendor = yield call(get);

    yield put(vendorSuccess(vendor));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetVendor() {
  yield takeLatest(GET_VENDOR, getVendor);
}
