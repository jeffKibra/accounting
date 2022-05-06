import { put, call, select, takeLatest } from "redux-saga/effects";
import { updateDoc, doc, serverTimestamp } from "firebase/firestore";

import { db } from "../../../utils/firebase";
import { UPDATE_INVOICE, DELETE_INVOICE } from "../../actions/invoicesActions";
import { start, success, fail } from "../../slices/invoicesSlice";
import {
  error as toastError,
  success as toastSuccess,
} from "../../slices/toastSlice";

function* updateInvoice({ data }) {
  yield put(start(UPDATE_INVOICE));
  const orgId = yield select((state) => state.orgsReducer.org.id);
  const userProfile = yield select((state) => state.authReducer.userProfile);
  const { email } = userProfile;
  const { invoiceId, ...rest } = data;
  // console.log({ data, orgId, userProfile });

  async function update() {
    await updateDoc(doc(db, "organizations", orgId, "invoices", invoiceId), {
      ...rest,
      modifiedBy: email,
      modifiedAt: serverTimestamp(),
    });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess("Invoice updated Sucessfully!"));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchUpdateInvoice() {
  yield takeLatest(UPDATE_INVOICE, updateInvoice);
}

function* deleteInvoice({ invoiceId }) {
  yield put(start(DELETE_INVOICE));
  const orgId = yield select((state) => state.orgsReducer.org.id);
  const userProfile = yield select((state) => state.authReducer.userProfile);
  const { email } = userProfile;
  console.log({ invoiceId, orgId, userProfile });

  async function update() {
    await updateDoc(doc(db, "organizations", orgId, "invoices", invoiceId), {
      status: "deleted",
      modifiedBy: email,
      modifiedAt: serverTimestamp(),
    });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess("Invoice updated Sucessfully!"));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchDeleteInvoice() {
  yield takeLatest(DELETE_INVOICE, deleteInvoice);
}
