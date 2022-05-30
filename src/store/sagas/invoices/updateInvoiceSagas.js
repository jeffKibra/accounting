import { put, call, select, takeLatest } from "redux-saga/effects";
import {
  doc,
  serverTimestamp,
  runTransaction,
  increment,
} from "firebase/firestore";

import { db } from "../../../utils/firebase";
import { UPDATE_INVOICE } from "../../actions/invoicesActions";
import { start, success, fail } from "../../slices/invoicesSlice";
import {
  error as toastError,
  success as toastSuccess,
} from "../../slices/toastSlice";

import {
  updateSimilarAccountEntries,
  deleteSimilarAccountEntries,
  createSimilarAccountEntries,
} from "../../../utils/journals";
import {
  getInvoiceData,
  getSummaryEntries,
  getIncomeAccountsMapping,
  getIncomeEntries,
  createInvoiceSlug,
} from "../../../utils/invoices";
import { getCustomerData } from "../../../utils/customers";
import { getAccountData } from "../../../utils/accounts";

function* updateInvoice({ data }) {
  yield put(start(UPDATE_INVOICE));
  const orgId = yield select((state) => state.orgsReducer.org.id);
  const userProfile = yield select((state) => state.authReducer.userProfile);
  const { email } = userProfile;
  const accounts = yield select((state) => state.accountsReducer.accounts);

  const { invoiceId, ...rest } = data;
  const { summary, selectedItems, customerId } = rest;
  // console.log({ data, orgId, userProfile });
  const { totalTaxes, shipping, adjustment, totalAmount } = summary;

  async function update() {
    const invoiceRef = doc(db, "organizations", orgId, "invoices", invoiceId);

    await runTransaction(db, async (transaction) => {
      const [currentInvoice, customer] = await Promise.all([
        getInvoiceData(transaction, orgId, invoiceId),
        getCustomerData(transaction, orgId, customerId),
      ]);
      const { customerId: currentCustomerId, selectedItems: items } =
        currentInvoice;
      const currentCustomerRef = doc(
        db,
        "organizations",
        orgId,
        "customers",
        currentCustomerId
      );
      //check if customer has been changed
      const customerHasChanged = currentCustomerId !== customerId;

      const invoiceSlug = customerHasChanged
        ? createInvoiceSlug(customer)
        : currentInvoice.invoiceSlug;

      const { shippingEntry, adjustmentEntry, taxEntry, receivableEntry } =
        await getSummaryEntries(
          customerHasChanged,
          orgId,
          currentInvoice,
          summary
        );

      const { deletedAccounts, newAccounts, updatedAccounts, similarAccounts } =
        getIncomeAccountsMapping(items, selectedItems);

      const accountsToUpdate = customerHasChanged
        ? [...updatedAccounts, ...similarAccounts]
        : updatedAccounts;

      /**
       * get entries data for deletedAccounts and accountsToUpdate
       */
      const [entriesToUpdate, entriesToDelete] = await Promise.all([
        getIncomeEntries(orgId, currentInvoice, accountsToUpdate),
        getIncomeEntries(orgId, currentInvoice, deletedAccounts),
      ]);

      // console.log({ itemsEntries });
      // console.log({
      //   shippingEntry,
      //   adjustmentEntry,
      //   taxEntry,
      //   receivableEntry,
      // });

      //invoiceSummary
      const invoiceSummary = currentInvoice.summary;

      const transactionDetails = {
        ...data,
        invoiceSlug,
        invoiceId,
      };
      const transactionId = invoiceSlug;

      /**
       * start writing
       */

      /**
       * update entries
       */
      entriesToUpdate.forEach((entry) => {
        const { accountId, incoming, credit, debit, entryId } = entry;
        const entryAccount = getAccountData(accountId, accounts);

        updateSimilarAccountEntries(
          transaction,
          userProfile,
          orgId,
          entryAccount,
          [
            {
              amount: incoming,
              account: entryAccount,
              credit,
              debit,
              entryId,
              transactionDetails,
              transactionId,
            },
          ]
        );
      });
      /**
       * delete deleted income accounts
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
       * create new entries for new income accounts
       */
      newAccounts.forEach((incomeAccount) => {
        const { accountId, incoming } = incomeAccount;
        const entryAccount = getAccountData(accountId, accounts);

        createSimilarAccountEntries(
          transaction,
          userProfile,
          orgId,
          entryAccount,
          [
            {
              amount: incoming,
              account: entryAccount,
              reference: "",
              transactionDetails,
              transactionId,
              transactionType: "invoice",
            },
          ]
        );
      });

      //shipping has changed?
      if (shippingEntry) {
        const { credit, debit, entryId } = shippingEntry;
        const entryAccount = getAccountData("shipping_charge", accounts);

        updateSimilarAccountEntries(
          transaction,
          userProfile,
          orgId,
          entryAccount,
          [
            {
              amount: shipping,
              account: entryAccount,
              credit,
              debit,
              entryId,
              transactionId,
              transactionDetails,
            },
          ]
        );
      }
      /**
       * update adjustment entry
       */
      if (adjustmentEntry) {
        const { entryId, credit, debit } = adjustmentEntry;
        const entryAccount = getAccountData("other_charges", accounts);

        updateSimilarAccountEntries(
          transaction,
          userProfile,
          orgId,
          entryAccount,
          [
            {
              amount: adjustment,
              account: entryAccount,
              credit,
              debit,
              entryId,
              transactionId,
              transactionDetails,
            },
          ]
        );
      }
      /**
       * update tax entry
       */
      if (taxEntry) {
        const { entryId, credit, debit } = taxEntry;
        const entryAccount = getAccountData("tax_payable", accounts);

        updateSimilarAccountEntries(
          transaction,
          userProfile,
          orgId,
          entryAccount,
          [
            {
              amount: totalTaxes,
              account: entryAccount,
              credit,
              debit,
              entryId,
              transactionId,
              transactionDetails,
            },
          ]
        );
      }
      /**
       * update accounts_receivable entry
       * totalAmount
       */
      if (receivableEntry) {
        const { entryId, credit, debit } = receivableEntry;
        const entryAccount = getAccountData("accounts_receivable", accounts);

        updateSimilarAccountEntries(
          transaction,
          userProfile,
          orgId,
          entryAccount,
          [
            {
              amount: totalAmount,
              account: entryAccount,
              credit,
              debit,
              entryId,
              transactionId,
              transactionDetails,
            },
          ]
        );
      }

      //update customer summaries
      const newCustomerRef = doc(
        db,
        "organizations",
        orgId,
        "customers",
        customerId
      );
      if (customerHasChanged) {
        //delete values from previous customer
        transaction.update(currentCustomerRef, {
          "summary.invoicedAmount": increment(0 - invoiceSummary.totalAmount),
          "summary.deletedInvoices": increment(1),
        });
        //add new values to the incoming customer
        transaction.update(newCustomerRef, {
          "summary.invoicedAmount": increment(summary.totalAmount),
          "summary.invoices": increment(1),
        });
      } else {
        if (invoiceSummary.totalAmount !== summary.totalAmount) {
          const adjustment = summary.totalAmount - invoiceSummary.totalAmount;
          //update customer summaries
          transaction.update(currentCustomerRef, {
            "summary.invoicedAmount": increment(adjustment),
          });
        }
      }
      /**
       * update invoice
       */
      transaction.update(invoiceRef, {
        ...rest,
        invoiceSlug,
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
