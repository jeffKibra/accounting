import { put, call, select, takeLatest } from "redux-saga/effects";
import {
  doc,
  serverTimestamp,
  runTransaction,
  increment,
} from "firebase/firestore";

import { db } from "../../../utils/firebase";
import { DELETE_INVOICE } from "../../actions/invoicesActions";
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

function* deleteInvoice({ invoiceId }) {
  yield put(start(DELETE_INVOICE));
  const orgId = yield select((state) => state.orgsReducer.org.id);
  const userProfile = yield select((state) => state.authReducer.userProfile);
  const { email } = userProfile;
  //   console.log({ invoiceId, orgId, userProfile });

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
        await getSummaryEntries(true, orgId, invoiceData, {
          shipping: 0,
          adjustment: 0,
          totalTaxes: 0,
          totalAmount: 0,
        });
      const itemsEntries = await getItemsEntriesToUpdate(
        transaction,
        true,
        orgId,
        invoiceData,
        []
      );
      //   console.log({ itemsEntries });
      //   console.log({
      //     shippingEntry,
      //     adjustmentEntry,
      //     taxEntry,
      //     receivableEntry,
      //   });

      //update itemsEntries
      itemsEntries.forEach((entry) => {
        const { accountId, entryData } = entry;
        const { entryId, credit, debit } = entryData;

        incomeEntry.deleteEntry(
          transaction,
          userProfile,
          orgId,
          entryId,
          accountId,
          {
            credit,
            debit,
          }
        );
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
        "summary.deletedInvoices": increment(1),
        "summary.invoicedAmount": increment(-totalAmount),
      });
      //update org summaries
      transaction.update(countersRef, {
        deletedInvoices: increment(1),
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
