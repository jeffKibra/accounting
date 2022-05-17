import { put, call, select, takeLatest } from "redux-saga/effects";
import {
  doc,
  collection,
  serverTimestamp,
  runTransaction,
  increment,
} from "firebase/firestore";

import { db } from "../../../utils/firebase";
import { CREATE_INVOICE } from "../../actions/invoicesActions";
import { start, success, fail } from "../../slices/invoicesSlice";
import {
  error as toastError,
  success as toastSuccess,
} from "../../slices/toastSlice";

function* createInvoice({ data }) {
  yield put(start(CREATE_INVOICE));
  const org = yield select((state) => state.orgsReducer.org);
  const orgId = org.id;
  const userProfile = yield select((state) => state.authReducer.userProfile);
  const { email } = userProfile;
  console.log({ data });
  const { customerId, summary, selectedItems } = data;

  async function create() {
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
    const newDocRef = doc(collection(db, "organizations", orgId, "invoices"));

    await runTransaction(db, async (transaction) => {
      const [customerDoc] = await transaction.get(customerRef);
      if (!customerDoc.exists) {
        throw new Error("Selected customer not found!");
      }

      const customer = customerDoc.data();
      const customerSummary = customer.summary;

      const invoiceNumber = (customerSummary?.invoices || 0) + 1;
      const invoiceSlug = `INV-${String(invoiceNumber).padStart(6, 0)}`;

      transaction.update(customerRef, {
        "summary.invoices": increment(1),
        "summary.invoicesTotal": increment(summary.totalAmount),
      });

      transaction.update(countersRef, {
        invoices: increment(1),
      });

      transaction.set(newDocRef, {
        ...data,
        payments: {},
        status: "sent",
        invoiceNumber,
        invoiceSlug,
        org,
        plus: "icons",
        createdBy: email,
        createdAt: serverTimestamp(),
        modifiedBy: email,
        modifiedAt: serverTimestamp(),
      });
    });

    // console.log({ latestInvoice, invoiceNumber, invoiceSlug });
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
