import { put, call, select, takeLatest } from "redux-saga/effects";
import {
  getDocs,
  getDoc,
  doc,
  collection,
  query,
  where,
  orderBy,
} from "firebase/firestore";

import { db } from "../../../utils/firebase";

import { GET_VENDORS, GET_VENDOR } from "../../actions/vendorsActions";
import {
  start,
  vendorSuccess,
  vendorsSuccess,
  fail,
} from "../../slices/vendorsSlice";
import { error as toastError } from "../../slices/toastSlice";

function* getVendors() {
  yield put(start(GET_VENDORS));

  const orgId = yield select((state) => state.orgsReducer.org.id);

  async function get() {
    const q = query(
      collection(db, "organizations", orgId, "vendors"),
      orderBy("createdAt", "desc"),
      where("status", "==", "active")
    );
    const snap = await getDocs(q);
    const vendors = [];

    snap.forEach((vendorDoc) => {
      vendors.push({
        ...vendorDoc.data(),
        vendorId: vendorDoc.id,
      });
    });

    return vendors;
  }

  try {
    const vendors = yield call(get);

    yield put(vendorsSuccess(vendors));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetVendors() {
  yield takeLatest(GET_VENDORS, getVendors);
}

function* getVendor({ vendorId }) {
  yield put(start(GET_VENDOR));

  const orgId = yield select((state) => state.orgsReducer.org.id);

  async function get() {
    const vendorDoc = await getDoc(
      doc(db, "organizations", orgId, "vendors", vendorId)
    );
    if (!vendorDoc.exists) {
      throw new Error("Vendor not found!");
    }

    return {
      ...vendorDoc.data(),
      vendorId,
    };
  }

  try {
    const vendor = yield call(get);

    yield put(vendorSuccess(vendor));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetVendor() {
  yield takeLatest(GET_VENDOR, getVendor);
}
