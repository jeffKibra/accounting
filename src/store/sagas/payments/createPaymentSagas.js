import { put, call, select, takeLatest } from "redux-saga/effects";
import { doc, serverTimestamp, runTransaction } from "firebase/firestore";

import { db } from "../../../utils/firebase";
import { CREATE_PAYMENT } from "../../actions/paymentsActions";
import { start, success, fail } from "../../slices/paymentsSlice";
import {
  error as toastError,
  success as toastSuccess,
} from "../../slices/toastSlice";

function* createPayment({ data }) {
  yield put(start(CREATE_PAYMENT));
  const org = yield select((state) => state.orgsReducer.org);
  const orgId = org.id;
  const userProfile = yield select((state) => state.authReducer.userProfile);
  const { email } = userProfile;
  console.log({ data, orgId, userProfile });
  const { paymentId, ...rest } = data;
  const {
    customerId,
    paidInvoices,
    summary: { excess, paidAmount, amount },
  } = rest;

  async function create() {
    const newDocRef = doc(db, "organizations", orgId, "payments", paymentId);
    const orgRef = doc(db, "organizations", orgId);
    const customerRef = doc(
      db,
      "organizations",
      orgId,
      "customers",
      customerId
    );

    await runTransaction(db, async (transaction) => {
      const [orgDoc, customerDoc, invoices] = await Promise.all([
        transaction.get(orgRef),
        transaction.get(customerRef),
        Promise.all(
          paidInvoices.map(async (invoice) => {
            const { invoiceId } = invoice;
            const invoiceRef = doc(
              db,
              "organizations",
              orgId,
              "invoices",
              invoiceId
            );

            const invoiceDoc = await transaction.get(invoiceRef);
            if (!invoiceDoc.exists) {
              throw new Error("Invoice data not found!");
            }

            const currentInvoice = invoiceDoc.data();

            return {
              invoice,
              invoiceRef,
              currentInvoice,
            };
          })
        ),
      ]);

      if (!orgDoc.exists) {
        throw new Error("Organization data not found!");
      }
      const orgSummary = orgDoc.data().summary;
      if (!customerDoc.exists) {
        throw new Error("Customer data not found!");
      }
      const customerSummary = customerDoc.data().summary;

      const paymentNumber = (customerSummary?.paymentsCount || 0) + 1;
      const paymentSlug = `INV-R-${String(paymentNumber).padStart(6, 0)}`;

      // console.log({ latestPayment, paymentNumber, paymentSlug });

      transaction.update(orgRef, {
        "summary.paymentsTotal": +orgSummary?.paymentsTotal + amount,
        "summary.paymentsCount": +orgSummary?.paymentsCount + 1,
        "summary.invoicesBalance": +orgSummary.invoicesBalance - paidAmount,
        modifiedBy: email,
        modifiedAt: serverTimestamp(),
      });

      transaction.update(customerRef, {
        "summary.paymentsTotal": +customerSummary?.paymentsTotal + amount,
        "summary.paymentsCount": +customerSummary?.paymentsCount + 1,
        "summary.wallet": +customerSummary?.wallet + excess,
        "summary.invoicesBalance":
          +customerSummary.invoicesBalance - paidAmount,
        modifiedBy: email,
        modifiedAt: serverTimestamp(),
      });

      // update invoices
      invoices.forEach(({ invoice, invoiceRef, currentInvoice }) => {
        const { summary: invoiceSummary, payments } = invoice;
        const { summary: currentSummary, payments: currentPayments } =
          currentInvoice;
        const payment = payments[paymentId];
        console.log({ payment });

        const status =
          invoiceSummary.balance === 0
            ? "paid"
            : invoiceSummary.balance < invoiceSummary.totalAmount
            ? "partially paid"
            : invoiceSummary.status;

        transaction.update(invoiceRef, {
          "summary.balance": currentSummary.balance - payment.amount,
          status,
          payments: {
            ...currentPayments,
            [paymentId]: payment,
          },
          // invoiceSummary,
          modifiedBy: email,
          modifiedAt: serverTimestamp(),
        });
      });

      const allData = {
        ...rest,
        status: "active",
        paymentNumber,
        paymentSlug,
        org,
        createdBy: email,
        createdAt: serverTimestamp(),
        modifiedBy: email,
        modifiedAt: serverTimestamp(),
      };
      console.log({ allData });

      transaction.set(
        newDocRef,
        {
          ...rest,
          status: "active",
          paymentNumber,
          paymentSlug,
          org,
          createdBy: email,
          createdAt: serverTimestamp(),
          modifiedBy: email,
          modifiedAt: serverTimestamp(),
        },
        { merge: true }
      );
    });
  }

  try {
    yield call(create);

    yield put(success());
    yield put(toastSuccess("Payment created Sucessfully!"));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchCreatePayment() {
  yield takeLatest(CREATE_PAYMENT, createPayment);
}
