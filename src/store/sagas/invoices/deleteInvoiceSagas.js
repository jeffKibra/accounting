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

import {
  deleteSimilarAccountEntries,
  groupEntriesIntoAccounts,
} from "../../../utils/journals";
import {
  getInvoiceData,
  getAllInvoiceEntries,
  getInvoicePaymentsTotal,
} from "../../../utils/invoices";

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
      const [invoiceData, allEntries] = await Promise.all([
        getInvoiceData(transaction, orgId, invoiceId),
        getAllInvoiceEntries(orgId, invoiceId),
      ]);
      /**
       * check if the invoice has payments
       */
      const paymentsTotal = getInvoicePaymentsTotal(invoiceData.payments);
      if (paymentsTotal > 0) {
        //deletion not allowed
        throw new Error(
          `Invoice Deletion Failed! You cannot delete an invoice that has payments! If you are sure you want to delete it, Please DELETE all the associated PAYMENTS first!`
        );
      }
      /**
       * group entries into accounts
       */
      const accounts = groupEntriesIntoAccounts(allEntries);

      const {
        customerId,
        summary: { totalAmount },
      } = invoiceData;

      /**
       * start writing
       */

      /**
       * delete entries and update accounts summaries
       */
      accounts.forEach((group) => {
        const { entries, ...account } = group;

        deleteSimilarAccountEntries(
          transaction,
          userProfile,
          orgId,
          account,
          entries
        );
      });

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
        "summary.invoicedAmount": increment(0 - totalAmount),
      });
      /**
       * update org counters summaries
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
