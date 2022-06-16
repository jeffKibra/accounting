import { put, call, select, takeLatest } from "redux-saga/effects";
import {
  doc,
  collection,
  serverTimestamp,
  runTransaction,
  increment,
} from "firebase/firestore";

import { db } from "../../../utils/firebase";
import { createSimilarAccountEntries } from "../../../utils/journals";
import { getAccountData } from "../../../utils/accounts";
import { getDateDetails } from "../../../utils/dates";
import { createDailySummary } from "../../../utils/summaries";
import { createInvoice } from "../../../utils/invoices";

import { CREATE_CUSTOMER } from "../../actions/customersActions";
import { start, success, fail } from "../../slices/customersSlice";
import {
  success as toastSuccess,
  error as toastError,
} from "../../slices/toastSlice";

function* createCustomer({ data }) {
  yield put(start(CREATE_CUSTOMER));
  const org = yield select((state) => state.orgsReducer.org);
  const orgId = org.id;
  const userProfile = yield select((state) => state.authReducer.userProfile);
  const { email } = userProfile;
  const accounts = yield select((state) => state.accountsReducer.accounts);

  // console.log({ data });

  async function create() {
    const newDocRef = doc(collection(db, "organizations", orgId, "customers"));
    const customerId = newDocRef.id;
    const { yearMonthDay } = getDateDetails();
    const summaryRef = doc(
      db,
      "organizations",
      orgId,
      "summaries",
      yearMonthDay
    );
    /**
     * create daily summary data
     */
    await createDailySummary(orgId);

    await runTransaction(db, async (transaction) => {
      const { openingBalance, paymentTermId, paymentTerm } = data;

      const transactionDetails = {
        ...data,
        customerId,
        status: "active",
        summary: {
          invoices: 0,
          deletedInvoices: 0,
          payments: 0,
          deletedPayments: 0,
          unusedCredits: 0,
          invoicedAmount: openingBalance,
          invoicePayments: 0,
        },
      };

      transaction.update(summaryRef, {
        customers: increment(1),
      });
      /**
       * if opening balance is greater than zero
       * create journal entries and an equivalent invoice
       */
      if (openingBalance > 0) {
        /**
         * create 2 journal entries
         * 1. debit sales accountType= opening balance
         * 2. credit opening_balance_adjustments accountType= opening balance
         */
        /**
         * 1. debit sales
         * to debit income, amount must be negative
         */
        const sales = getAccountData("sales", accounts);
        createSimilarAccountEntries(transaction, userProfile, orgId, sales, [
          {
            amount: 0 - openingBalance,
            account: sales,
            reference: "",
            transactionDetails,
            transactionId: customerId,
            transactionType: "opening balance",
          },
        ]);
        /**
         * 2. credit opening_balance_adjustments entry for customer opening balance
         */
        const obAdjustments = getAccountData(
          "opening_balance_adjustments",
          accounts
        );
        createSimilarAccountEntries(
          transaction,
          userProfile,
          orgId,
          obAdjustments,
          [
            {
              amount: +openingBalance,
              account: obAdjustments,
              reference: "",
              transactionDetails,
              transactionId: customerId,
              transactionType: "opening balance",
            },
          ]
        );
        /**
         * create an invoice equivalent for for customer opening balance
         */
        const salesAccount = getAccountData("sales", accounts);
        await createInvoice(
          transaction,
          org,
          userProfile,
          accounts,
          "customer opening balance",
          {
            customerId,
            customer: transactionDetails,
            invoiceDate: serverTimestamp(),
            dueDate: serverTimestamp(),
            paymentTerm,
            paymentTermId,
            summary: {
              shipping: 0,
              adjustment: 0,
              subTotal: 0,
              totalTaxes: 0,
              totalAmount: openingBalance,
            },
            selectedItems: [
              {
                salesAccount,
                salesAccountId: salesAccount.accountId,
                totalAmount: openingBalance,
              },
            ],
          },
          "customer opening balance"
        );
      }
      /**
       * create customer
       */
      const { customerId: cid, ...tDetails } = transactionDetails;
      transaction.set(newDocRef, {
        ...tDetails,
        createdBy: email,
        createdAt: serverTimestamp(),
        modifiedBy: email,
        modifiedAt: serverTimestamp(),
      });
    });
  }

  try {
    yield call(create);

    yield put(success());
    yield put(toastSuccess("Customer added successfully!"));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchCreateCustomer() {
  yield takeLatest(CREATE_CUSTOMER, createCustomer);
}
