import { put, call, select, takeLatest } from "redux-saga/effects";
import {
  doc,
  collection,
  serverTimestamp,
  runTransaction,
  increment,
} from "firebase/firestore";

import { db } from "../../../utils/firebase";
import { CREATE_INVOICE } from "../../actions/invoicesActions";
import { start, success, fail } from "../../slices/invoicesSlice";
import {
  error as toastError,
  success as toastSuccess,
} from "../../slices/toastSlice";

import { assetEntry, liabilityEntry, incomeEntry } from "../journals";
import { getSalesAccounts, getAccountData } from "./utils";
import accounts from "../../../utils/accounts";

function* createInvoice({ data }) {
  yield put(start(CREATE_INVOICE));
  const org = yield select((state) => state.orgsReducer.org);
  const orgId = org.id;
  const userProfile = yield select((state) => state.authReducer.userProfile);
  const { email } = userProfile;
  console.log({ data });
  const { customerId, summary, selectedItems } = data;
  //group sales accounts

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

    await runTransaction(db, async (transaction) => {
      const [
        customerDoc,
        salesAccounts,
        accounts_receivable,
        tax_payable,
        other_charges,
        shipping_charge,
      ] = await Promise.all([
        transaction.get(customerRef),
        getSalesAccounts(transaction, orgId, selectedItems),
        getAccountData(transaction, orgId, "accounts_receivable"),
        getAccountData(transaction, orgId, "tax_payable"),
        getAccountData(transaction, orgId, "other_charges"),
        getAccountData(transaction, orgId, "shipping_charge"),
      ]);
      console.log({ salesAccounts, selectedItems });
      if (!customerDoc.exists) {
        throw new Error("Selected customer not found!");
      }

      const customer = customerDoc.data();
      const customerSummary = customer.summary;

      const invoiceNumber = (customerSummary?.invoices || 0) + 1;
      const invoiceSlug = `INV-${String(invoiceNumber).padStart(6, 0)}`;

      //create journal entries for income accounts
      salesAccounts.forEach((account) => {
        const { salesAmount, ...rest } = account;
        const { accountId } = rest;

        incomeEntry.newEntry(transaction, userProfile, orgId, accountId, {
          amount: salesAmount,
          account: rest,
          reference: "",
          transactionId: invoiceSlug,
          transactionType: "invoice",
          transactionDetails: { ...customer, customerId },
        });
      });
      console.log({ summary });
      //journal entry for invoice total-accounts receivable
      assetEntry.newEntry(
        transaction,
        userProfile,
        orgId,
        "accounts_receivable",
        {
          reference: "",
          transactionType: "invoice",
          transactionId: invoiceSlug,
          transactionDetails: { ...customer, customerId },
          account: accounts_receivable,
          amount: summary.totalAmount,
        }
      );
      //journal entry for taxes-tax_payable-liability account
      liabilityEntry.newEntry(transaction, userProfile, orgId, "tax_payable", {
        amount: summary.totalTaxes,
        reference: "",
        transactionId: invoiceSlug,
        transactionType: "invoice",
        transactionDetails: { ...customer, customerId },
        account: tax_payable,
      });
      //shipping charge
      if (summary.shipping) {
        incomeEntry.newEntry(
          transaction,
          userProfile,
          orgId,
          "shipping_charge",
          {
            amount: summary.shipping,
            reference: "",
            transactionId: invoiceSlug,
            transactionType: "invoice",
            transactionDetails: { ...customer, customerId },

            account: shipping_charge,
          }
        );
      }
      //adjustments
      if (summary.adjustment) {
        incomeEntry.newEntry(transaction, userProfile, orgId, "other_charges", {
          account: other_charges,
          amount: summary.adjustment,
          reference: "",
          transactionId: invoiceSlug,
          transactionType: "invoice",
          transactionDetails: { ...customer, customerId },
        });
      }

      //update customer summaries
      transaction.update(customerRef, {
        "summary.invoices": increment(1),
        "summary.invoicedAmount": increment(summary.totalAmount),
      });
      //update org summaries
      transaction.update(countersRef, {
        invoices: increment(1),
      });

      const ddata = {
        ...data,
        payments: {},
        status: "sent",
        invoiceNumber,
        invoiceSlug,
        org,
        createdBy: email,
        createdAt: serverTimestamp(),
        modifiedBy: email,
        modifiedAt: serverTimestamp(),
      };
      console.log({ ddata });

      //create invoice
      transaction.set(newDocRef, {
        ...data,
        payments: {},
        status: "sent",
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
