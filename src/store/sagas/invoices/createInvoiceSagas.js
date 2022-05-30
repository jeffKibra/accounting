import { put, call, select, takeLatest } from "redux-saga/effects";
import {
  doc,
  collection,
  serverTimestamp,
  runTransaction,
  increment,
} from "firebase/firestore";

import { db } from "../../../utils/firebase";
import { getIncomeAccountsMapping } from "../../../utils/invoices";

import { CREATE_INVOICE } from "../../actions/invoicesActions";
import { start, success, fail } from "../../slices/invoicesSlice";
import {
  error as toastError,
  success as toastSuccess,
} from "../../slices/toastSlice";

import { createSimilarAccountEntries } from "../../../utils/journals";
import { getAccountData } from "../../../utils/accounts";

function* createInvoice({ data }) {
  yield put(start(CREATE_INVOICE));
  const org = yield select((state) => state.orgsReducer.org);
  const orgId = org.id;
  const userProfile = yield select((state) => state.authReducer.userProfile);
  const { email } = userProfile;
  const accounts = yield select((state) => state.accountsReducer.accounts);
  console.log({ data });
  const { customerId, summary, selectedItems } = data;
  //group sales accounts

  /**
   * accounts details
   */
  const accounts_receivable = getAccountData("accounts_receivable", accounts);
  const tax_payable = getAccountData("tax_payable", accounts);
  const shipping_charge = getAccountData("shipping_charge", accounts);
  const other_charges = getAccountData("other_charges", accounts);

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
    const invoiceId = newDocRef.id;

    await runTransaction(db, async (transaction) => {
      const [customerDoc] = await Promise.all([transaction.get(customerRef)]);
      console.log({ selectedItems });
      if (!customerDoc.exists) {
        throw new Error("Selected customer not found!");
      }

      const customer = customerDoc.data();
      const customerSummary = customer.summary;

      const invoiceNumber = (customerSummary?.invoices || 0) + 1;
      const invoiceSlug = `INV-${String(invoiceNumber).padStart(6, 0)}`;

      const invoiceData = {
        ...data,
        payments: {},
        status: "sent",
        invoiceNumber,
        invoiceSlug,
        org,
      };
      console.log({ invoiceData });
      const transactionDetails = { ...invoiceData, invoiceId };
      const transactionType = "invoice";
      const transactionId = invoiceSlug;
      const reference = "";

      /**
       * create journal entries for income accounts
       */
      const { newAccounts } = getIncomeAccountsMapping([], selectedItems);

      newAccounts.forEach((newAccount) => {
        const { accountId, incoming } = newAccount;
        const salesAccount = getAccountData(accountId, accounts);

        createSimilarAccountEntries(
          transaction,
          userProfile,
          orgId,
          salesAccount,
          [
            {
              amount: incoming,
              account: salesAccount,
              reference,
              transactionId,
              transactionType,
              transactionDetails,
            },
          ]
        );
      });
      console.log({ summary });
      /**
       * journal entry for invoice total => accounts_receivable
       */
      createSimilarAccountEntries(
        transaction,
        userProfile,
        orgId,
        accounts_receivable,
        [
          {
            amount: summary.totalAmount,
            account: accounts_receivable,
            reference,
            transactionId,
            transactionType,
            transactionDetails,
          },
        ]
      );

      /**
       * journal entry for taxes => tax_payable-liability account
       */
      createSimilarAccountEntries(
        transaction,
        userProfile,
        orgId,
        tax_payable,
        [
          {
            amount: summary.totalTaxes,
            account: tax_payable,
            reference,
            transactionId,
            transactionType,
            transactionDetails,
          },
        ]
      );
      /**
       * shipping charge
       */
      createSimilarAccountEntries(
        transaction,
        userProfile,
        orgId,
        shipping_charge,
        [
          {
            amount: summary.shipping,
            account: shipping_charge,
            reference,
            transactionId,
            transactionType,
            transactionDetails,
          },
        ]
      );
      /**
       * adjustments
       */
      createSimilarAccountEntries(
        transaction,
        userProfile,
        orgId,
        other_charges,
        [
          {
            amount: summary.adjustment,
            account: other_charges,
            reference,
            transactionDetails,
            transactionId,
            transactionType,
          },
        ]
      );
      /**
       * update customer summaries
       */
      transaction.update(customerRef, {
        "summary.invoices": increment(1),
        "summary.invoicedAmount": increment(summary.totalAmount),
      });
      /**
       * update org summaries
       */
      transaction.update(countersRef, {
        invoices: increment(1),
      });
      /**
       * create invoice
       */
      transaction.set(newDocRef, {
        ...invoiceData,
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
