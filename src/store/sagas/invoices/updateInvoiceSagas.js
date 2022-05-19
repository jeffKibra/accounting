import { put, call, select, takeLatest } from "redux-saga/effects";
import {
  doc,
  serverTimestamp,
  runTransaction,
  increment,
} from "firebase/firestore";

import { db } from "../../../utils/firebase";
import { UPDATE_INVOICE, DELETE_INVOICE } from "../../actions/invoicesActions";
import { start, success, fail } from "../../slices/invoicesSlice";
import {
  error as toastError,
  success as toastSuccess,
} from "../../slices/toastSlice";

import { incomeEntry, assetEntry, liabilityEntry } from "../journals";
import {
  getAccountData,
  getSalesAccounts,
  getUpdatedSalesAccounts,
  getInvoiceData,
  getItemsEntriesToUpdate,
  getCustomerEntryData,
} from "./utils";

function* updateInvoice({ data }) {
  yield put(start(UPDATE_INVOICE));
  const orgId = yield select((state) => state.orgsReducer.org.id);
  const userProfile = yield select((state) => state.authReducer.userProfile);
  const { email } = userProfile;
  const { invoiceId, ...rest } = data;
  const { customerId, summary, selectedItems } = rest;
  // console.log({ data, orgId, userProfile });
  const { totalTaxes, shipping, adjustment, totalAmount } = summary;

  async function update() {
    const invoiceRef = doc(db, "organizations", orgId, "invoices", invoiceId);
    const customerRef = doc(
      db,
      "organizations",
      orgId,
      "customers",
      customerId
    );

    await runTransaction(db, async (transaction) => {
      const [invoiceData] = await Promise.all([
        getInvoiceData(transaction, orgId, invoiceId),
      ]);
      const { summary: prevSummary, invoiceSlug } = invoiceData;

      const [shipingEntry, adjustmentEntry, taxEntry, receivableEntry] =
        await Promise.all([
          getCustomerEntryData({
            orgId,
            customerId,
            accountId: "shipping_charge",
            transactionId: invoiceSlug,
            transactionType: "invoice",
            shouldFetch: shipping !== prevSummary.shipping,
          }),
          getCustomerEntryData({
            orgId,
            customerId,
            accountId: "other_charges",
            transactionId: invoiceSlug,
            transactionType: "invoice",
            shouldFetch: adjustment !== prevSummary.adjustment,
          }),
          getCustomerEntryData({
            orgId,
            customerId,
            accountId: "tax_payable",
            transactionId: invoiceSlug,
            transactionType: "invoice",
            shouldFetch: totalTaxes !== prevSummary.totalTaxes,
          }),
          getCustomerEntryData({
            orgId,
            customerId,
            accountId: "accounts_receivable",
            transactionId: invoiceSlug,
            transactionType: "invoice",
            shouldFetch: totalAmount !== prevSummary.totalAmount,
          }),
        ]);

      const itemsEntries = await getItemsEntriesToUpdate(
        orgId,
        invoiceData,
        selectedItems
      );
      console.log({ itemsEntries });

      //invoiceSummary
      const invoiceSummary = invoiceData.summary;

      //update itemsEntries
      itemsEntries.forEach((entry) => {
        const { entryId, accountId, amount, credit, debit } = entry;
        incomeEntry.updateEntry(
          transaction,
          userProfile,
          orgId,
          accountId,
          entryId,
          amount,
          {
            credit,
            debit,
          }
        );
      });

      console.log({ shipingEntry, adjustmentEntry, taxEntry, receivableEntry });

      //shipping has changed?
      // if (shipping !== prevSummary.shipping) {
      //   const { credit, debit, entryId } = shipingEntry;

      //   incomeEntry.updateEntry(
      //     transaction,
      //     userProfile,
      //     orgId,
      //     "shipping_charge",
      //     entryId,
      //     shipping,
      //     {}
      //   );
      // }

      if (invoiceSummary.totalAmount !== summary.totalAmount) {
        const adjustment = summary.totalAmount - invoiceSummary.totalAmount;
        //update customer summaries
        transaction.update(customerRef, {
          "summary.invoicedAmount": increment(adjustment),
        });
      }

      transaction.update(invoiceRef, {
        ...rest,
        classical: "plus",
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
    const countersRef = doc(
      db,
      "organizations",
      orgId,
      "summaries",
      "counters"
    );

    await runTransaction(db, async (transaction) => {
      const invoiceData = await getInvoiceData(transaction, orgId, invoiceId);

      const {
        customerId,
        summary: { totalAmount },
      } = invoiceData;
      const customerRef = doc(
        db,
        "organizations",
        orgId,
        "customers",
        customerId
      );

      //update customer summaries
      transaction.update(customerRef, {
        "summary.invoices": increment(-1),
        "summary.invoicedAmount": increment(-totalAmount),
      });
      //update org summaries
      transaction.update(countersRef, {
        invoices: increment(-1),
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
