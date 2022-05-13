import { put, call, select, takeLatest } from "redux-saga/effects";
import {
  doc,
  collection,
  serverTimestamp,
  runTransaction,
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
  console.log({ data, orgId, userProfile });
  const { customerId, summary } = data;

  async function create() {
    const customerRef = doc(
      db,
      "organizations",
      orgId,
      "customers",
      customerId
    );
    const orgRef = doc(db, "organizations", orgId);
    const newDocRef = doc(collection(db, "organizations", orgId, "invoices"));

    await runTransaction(db, async (transaction) => {
      const [customerDoc, orgDoc] = await Promise.all([
        transaction.get(customerRef),
        transaction.get(orgRef),
      ]);
      if (!customerDoc.exists) {
        throw new Error("Selected customer not found!");
      }
      if (!orgDoc.exists) {
        throw new Error("Orgnization data not found!");
      }
      const customer = customerDoc.data();
      const customerSummary = customer.summary;

      let invoiceNumber = customerSummary?.invoices || 0;
      let invoicesTotal = customerSummary?.invoicesTotal || 0;
      //org
      const orgData = orgDoc.data();
      const orgSummary = orgData.summary;

      let orgInvoices = orgSummary?.invoices || 0;
      let orgInvoicesTotal = orgSummary?.invoicesTotal || 0;

      invoiceNumber += 1;
      const invoiceSlug = `INV-${String(invoiceNumber).padStart(6, 0)}`;

      transaction.update(customerRef, {
        "summary.invoices": invoiceNumber,
        "summary.invoicesTotal": invoicesTotal + summary.totalAmount,
      });

      transaction.update(orgRef, {
        "summary.invoices": orgInvoices + 1,
        "summary.invoicesTotal": orgInvoicesTotal + summary.totalAmount,
      });

      transaction.set(newDocRef, {
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
