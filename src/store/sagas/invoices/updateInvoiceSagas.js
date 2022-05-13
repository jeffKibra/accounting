import { put, call, select, takeLatest } from "redux-saga/effects";
import { doc, serverTimestamp, runTransaction } from "firebase/firestore";

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
  const { customerId, summary } = rest;
  // console.log({ data, orgId, userProfile });

  async function update() {
    const invoiceRef = doc(db, "organizations", orgId, "invoices", invoiceId);
    const orgRef = doc(db, "organizations", orgId);
    const customerRef = doc(
      db,
      "organizations",
      orgId,
      "customers",
      customerId
    );

    await runTransaction(db, async (transaction) => {
      const [invoiceDoc, orgDoc, customerDoc] = await Promise.all([
        transaction.get(invoiceRef),
        transaction.get(orgRef),
        transaction.get(customerRef),
      ]);
      if (!invoiceDoc.exists) {
        throw new Error("Invoice Data not found!");
      }
      if (!orgDoc.exists) {
        throw new Error("Org Data not found!");
      }
      if (!customerDoc.exists) {
        throw new Error("Customer Data not found!");
      }
      //customerSummary
      const customerSummary = customerDoc.data().summary;
      //orgSummary
      const orgSummary = orgDoc.data().summary;
      //invoice summary
      const invoiceSummary = invoiceDoc.data().summary;

      if (invoiceSummary.totalAmount !== summary.totalAmount) {
        transaction.update(customerRef, {
          "summary.invoicesTotal":
            customerSummary.invoicesTotal -
            invoiceSummary.totalAmount +
            summary.totalAmount,
        });
        transaction.update(orgRef, {
          "summary.invoicesTotal":
            orgSummary.invoicesTotal -
            invoiceSummary.totalAmount +
            summary.totalAmount,
        });
      }

      transaction.update(invoiceRef, {
        ...rest,
        modifiedBy: email,
        modifiedAt: serverTimestamp(),
      });
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
    const invoiceRef = doc(db, "organizations", orgId, "invoices", invoiceId);
    const orgRef = doc(db, "organizations", orgId);

    await runTransaction(db, async (transaction) => {
      const [orgDoc, invoiceDoc] = await Promise.all([
        transaction.get(orgRef),
        transaction.get(invoiceRef),
      ]);

      if (!orgDoc.exists) {
        throw new Error("Organization data not found!");
      }
      if (!invoiceDoc.exists) {
        throw new Error("Invoice data not found!");
      }
      const {
        customerId,
        summary: { totalAmount },
      } = invoiceDoc.data();
      const customerRef = doc(
        db,
        "organizations",
        orgId,
        "customers",
        customerId
      );

      const customerDoc = await transaction.get(customerRef);
      if (!customerDoc.exists) {
        throw new Error("Customer data not found!");
      }
      //customer summary
      const customerSummary = customerDoc.data().summary;
      //org summary
      const orgSummary = orgDoc.data().summary;

      transaction.update(orgRef, {
        "summary.invoicesTotal": orgSummary.invoicesTotal - totalAmount,
        "summary.invoices": orgSummary.invoices - 1,
      });

      transaction.update(customerRef, {
        "summary.invoicesTotal": customerSummary.invoicesTotal - totalAmount,
        "summary.invoices": customerSummary.invoices - 1,
      });

      transaction.update(invoiceRef, {
        status: "deleted",
        modifiedBy: email,
        modifiedAt: serverTimestamp(),
      });
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
