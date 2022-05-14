import { put, call, select, takeLatest } from "redux-saga/effects";
import {
  doc,
  collection,
  serverTimestamp,
  runTransaction,
} from "firebase/firestore";

import { db } from "../../../utils/firebase";
import { CREATE_PAYMENT } from "../../actions/paymentsActions";
import { start, success, fail } from "../../slices/paymentsSlice";
import {
  error as toastError,
  success as toastSuccess,
} from "../../slices/toastSlice";

import { getLatestPayment } from "./getPaymentsSagas";

function* createPayment({ data }) {
  yield put(start(CREATE_PAYMENT));
  const org = yield select((state) => state.orgsReducer.org);
  const orgId = org.id;
  const userProfile = yield select((state) => state.authReducer.userProfile);
  const { email } = userProfile;
  console.log({ data, orgId, userProfile });
  const {
    customerId,
    paymentId,
    paidInvoices,
    summary: { excess, paidAmount, amount },
  } = data;

  async function create() {
    const newDocRef = doc(collection(db, "organizations", orgId, "payments"));
    const orgRef = doc(db, "organizations", orgId);
    const customerRef = doc(
      db,
      "organizations",
      orgId,
      "customers",
      customerId
    );

    await runTransaction(db, async (transaction) => {
      const [orgDoc, customerDoc] = await Promise.all([
        transaction.get(orgRef),
        transaction.get(customerRef),
      ]);
      if (!orgDoc.exists) {
        throw new Error("Organization data not found!");
      }
      if (!customerDoc.exists) {
        throw new Error("Customer data not found!");
      }

      const latestPayment = await getLatestPayment(orgId, customerId);

      let paymentNumber = 1;
      if (latestPayment) {
        paymentNumber = latestPayment.paymentNumber + 1;
      }
      const paymentSlug = `INV-R-${String(paymentNumber).padStart(6, 0)}`;

      // console.log({ latestPayment, paymentNumber, paymentSlug });

      transaction.set(newDocRef, {
        ...data,
        payments: [],
        status: "pending",
        paymentNumber,
        paymentSlug,
        org,
        // createdBy: email,
        // createdAt: serverTimestamp(),
        // modifiedBy: email,
        // modifiedAt: serverTimestamp(),
      });
    });
  }

  try {
    yield call(create);

    yield put(success());
    yield put(toastSuccess("payment created Sucessfully!"));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchCreatePayment() {
  yield takeLatest(CREATE_PAYMENT, createPayment);
}
