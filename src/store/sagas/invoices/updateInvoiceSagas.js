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
  getInvoiceData,
  getItemsEntriesToUpdate,
  getSummaryEntries,
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

      const { shippingEntry, adjustmentEntry, taxEntry, receivableEntry } =
        await getSummaryEntries(orgId, invoiceData, summary);

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

      console.log({
        shippingEntry,
        adjustmentEntry,
        taxEntry,
        receivableEntry,
      });

      //shipping has changed?
      if (shippingEntry) {
        const { credit, debit, entryId } = shippingEntry;

        incomeEntry.updateEntry(
          transaction,
          userProfile,
          orgId,
          "shipping_charge",
          entryId,
          shipping,
          { credit, debit }
        );
      }
      //adjustment entry
      if (adjustmentEntry) {
        const { entryId, credit, debit } = adjustmentEntry;

        incomeEntry.updateEntry(
          transaction,
          userProfile,
          orgId,
          "other_charges",
          entryId,
          adjustment,
          {
            credit,
            debit,
          }
        );
      }

      //tax entry
      if (taxEntry) {
        const { entryId, credit, debit } = taxEntry;

        liabilityEntry.updateEntry(
          transaction,
          userProfile,
          orgId,
          "tax_payable",
          entryId,
          totalTaxes,
          {
            credit,
            debit,
          }
        );
      }

      //receivable entry - totalAmount
      if (receivableEntry) {
        const { entryId, credit, debit } = receivableEntry;

        assetEntry.updateEntry(
          transaction,
          userProfile,
          orgId,
          "accounts_receivable",
          entryId,
          totalAmount,
          {
            credit,
            debit,
          }
        );
      }

      //update customer summaries
      if (invoiceSummary.totalAmount !== summary.totalAmount) {
        const adjustment = summary.totalAmount - invoiceSummary.totalAmount;
        //update customer summaries
        transaction.update(customerRef, {
          "summary.invoicedAmount": increment(adjustment),
        });
      }

      transaction.update(invoiceRef, {
        ...rest,
        // classical: "plus",
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
      const { shippingEntry, adjustmentEntry, taxEntry, receivableEntry } =
        await getSummaryEntries(orgId, invoiceData, {
          shipping: 0,
          adjustment: 0,
          totalTaxes: 0,
          totalAmount: 0,
        });
      console.log({
        shippingEntry,
        adjustmentEntry,
        taxEntry,
        receivableEntry,
      });

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

      if (shippingEntry) {
        const { entryId, credit, debit } = shippingEntry;
        incomeEntry.deleteEntry(
          transaction,
          userProfile,
          orgId,
          entryId,
          "shipping_charge",
          {
            credit,
            debit,
          }
        );
      }
      //adjustment value needs deleting
      if (adjustmentEntry) {
        const { entryId, credit, debit } = adjustmentEntry;
        incomeEntry.deleteEntry(
          transaction,
          userProfile,
          orgId,
          entryId,
          "other_charges",
          {
            credit,
            debit,
          }
        );
      }
      //taxes need deleting
      if (taxEntry) {
        const { entryId, credit, debit } = taxEntry;
        liabilityEntry.deleteEntry(
          transaction,
          userProfile,
          orgId,
          entryId,
          "tax_payable",
          {
            credit,
            debit,
          }
        );
      }
      //delete total amount
      if (receivableEntry) {
        const { entryId, credit, debit } = receivableEntry;
        assetEntry.deleteEntry(
          transaction,
          userProfile,
          orgId,
          entryId,
          "accounts_receivable",
          {
            credit,
            debit,
          }
        );
      }

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
        // opius: "none",
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
