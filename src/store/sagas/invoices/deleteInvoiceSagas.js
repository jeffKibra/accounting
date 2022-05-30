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

import { deleteSimilarAccountEntries } from "../../../utils/journals";
import {
  getInvoiceData,
  getSummaryEntries,
  getIncomeAccountsMapping,
  getIncomeEntries,
} from "../../../utils/invoices";
import { getAccountData } from "../../../utils/accounts";

function* deleteInvoice({ invoiceId }) {
  yield put(start(DELETE_INVOICE));
  const orgId = yield select((state) => state.orgsReducer.org.id);
  const userProfile = yield select((state) => state.authReducer.userProfile);
  const { email } = userProfile;
  const accounts = yield select((state) => state.accountsReducer.accounts);
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
      const {
        customerId,
        summary: { totalAmount },
      } = invoiceData;
      const { deletedAccounts } = getIncomeAccountsMapping(
        invoiceData.selectedItems,
        []
      );
      const entriesToDelete = await getIncomeEntries(
        orgId,
        invoiceData,
        deletedAccounts
      );

      //   console.log({ itemsEntries });
      //   console.log({
      //     shippingEntry,
      //     adjustmentEntry,
      //     taxEntry,
      //     receivableEntry,
      //   });

      /**
       * start writing
       */

      /**
       * delete income accounts entries
       */
      entriesToDelete.forEach((entry) => {
        const { accountId, credit, debit, entryId } = entry;
        const entryAccount = getAccountData(accountId, accounts);

        deleteSimilarAccountEntries(
          transaction,
          userProfile,
          orgId,
          entryAccount,
          [
            {
              account: entryAccount,
              credit,
              debit,
              entryId,
            },
          ]
        );
      });
      /**
       * delete shipping entry
       */
      if (shippingEntry) {
        const { entryId, credit, debit } = shippingEntry;
        const entryAccount = getAccountData("shipping_charge", accounts);

        deleteSimilarAccountEntries(
          transaction,
          userProfile,
          orgId,
          entryAccount,
          [
            {
              account: entryAccount,
              credit,
              debit,
              entryId,
            },
          ]
        );
      }
      /**
       * delete other_charges entry=>account for adjustments
       */
      if (adjustmentEntry) {
        const { entryId, credit, debit } = adjustmentEntry;
        const entryAccount = getAccountData("other_charges", accounts);

        deleteSimilarAccountEntries(
          transaction,
          userProfile,
          orgId,
          entryAccount,
          [
            {
              account: entryAccount,
              credit,
              debit,
              entryId,
            },
          ]
        );
      }
      /**
       * delete taxes entry
       */
      if (taxEntry) {
        const { entryId, credit, debit } = taxEntry;
        const entryAccount = getAccountData("tax_payable", accounts);

        deleteSimilarAccountEntries(
          transaction,
          userProfile,
          orgId,
          entryAccount,
          [
            {
              account: entryAccount,
              credit,
              debit,
              entryId,
            },
          ]
        );
      }
      /**
       * delete accounts_receivable entry
       */
      if (receivableEntry) {
        const { entryId, credit, debit } = receivableEntry;
        const entryAccount = getAccountData("accounts_receivable", accounts);

        deleteSimilarAccountEntries(
          transaction,
          userProfile,
          orgId,
          entryAccount,
          [
            {
              account: entryAccount,
              credit,
              debit,
              entryId,
            },
          ]
        );
      }
      /**
       * update customer summaries
       */
      const customerRef = doc(
        db,
        "organizations",
        orgId,
        "customers",
        customerId
      );
      transaction.update(customerRef, {
        "summary.deletedInvoices": increment(1),
        "summary.invoicedAmount": increment(-totalAmount),
      });
      /**
       * update org summaries
       */
      transaction.update(countersRef, {
        deletedInvoices: increment(1),
      });
      /**
       * mark invoice as deleted
       */
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
