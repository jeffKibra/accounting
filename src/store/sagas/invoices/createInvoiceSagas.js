import { put, call, select, takeLatest } from "redux-saga/effects";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { db } from "../../../utils/firebase";
import { CREATE_INVOICE } from "../../actions/invoicesActions";
import { start, success, fail } from "../../slices/invoicesSlice";
import {
  error as toastError,
  success as toastSuccess,
} from "../../slices/toastSlice";

import { getLatestInvoice } from "./getInvoicesSagas";

function* createInvoice({ data }) {
  yield put(start(CREATE_INVOICE));
  const org = yield select((state) => state.orgsReducer.org);
  const orgId = org.id;
  const userProfile = yield select((state) => state.authReducer.userProfile);
  const { email } = userProfile;
  console.log({ data, orgId, userProfile });

  async function create() {
    const latestInvoice = await getLatestInvoice(orgId);

    let invoiceNumber = 1;
    if (latestInvoice) {
      invoiceNumber = latestInvoice.invoiceNumber + 1;
    }
    const invoiceSlug = `INV-${String(invoiceNumber).padStart(6, 0)}`;

    // console.log({ latestInvoice, invoiceNumber, invoiceSlug });

    await addDoc(collection(db, "organizations", orgId, "invoices"), {
      ...data,
      payments: [],
      status: "pending",
      invoiceNumber,
      invoiceSlug,
      org,
      createdBy: email,
      createdAt: serverTimestamp(),
      modifiedBy: email,
      modifiedAt: serverTimestamp(),
    });
  }

  try {
    yield call(create);

    yield put(success());
    yield put(toastSuccess("Invoice created Sucessfully!"));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchCreateInvoice() {
  yield takeLatest(CREATE_INVOICE, createInvoice);
}
