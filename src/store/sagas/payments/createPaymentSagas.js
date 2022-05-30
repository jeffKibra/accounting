import { put, call, select, takeLatest } from "redux-saga/effects";
import {
  doc,
  collection,
  serverTimestamp,
  runTransaction,
  increment,
} from "firebase/firestore";

import { getAccountData } from "../../../utils/accounts";
import {
  getPaymentsTotal,
  payInvoices,
  getPaymentsMapping,
} from "../../../utils/payments";
import { getCustomerData } from "../../../utils/customers";
import { createSimilarAccountEntries } from "../../../utils/journals";

import { db } from "../../../utils/firebase";
import { CREATE_PAYMENT } from "../../actions/paymentsActions";
import { start, success, fail } from "../../slices/paymentsSlice";
import {
  error as toastError,
  success as toastSuccess,
} from "../../slices/toastSlice";
import formats from "../../../utils/formats";

function* createPayment({ data }) {
  yield put(start(CREATE_PAYMENT));
  try {
    const org = yield select((state) => state.orgsReducer.org);
    const orgId = org.id;
    const userProfile = yield select((state) => state.authReducer.userProfile);
    const { email } = userProfile;
    const accounts = yield select((state) => state.accountsReducer.accounts);
    // console.log({ data, orgId, userProfile });
    const { payments, customerId, amount, reference } = data;

    const paymentsTotal = getPaymentsTotal(payments);
    if (paymentsTotal > amount) {
      throw new Error(
        "Invoices payments cannot be more than customer payment!"
      );
    }
    const excess = amount - paymentsTotal;
    // console.log({ paymentsTotal, excess });

    //accounts data
    const unearned_revenue = getAccountData("unearned_revenue", accounts);
    //get payments to create formatted
    const { paymentsToCreate } = getPaymentsMapping({}, payments);

    async function create() {
      const newDocRef = doc(collection(db, "organizations", orgId, "payments"));
      const countersRef = doc(
        db,
        "organizations",
        orgId,
        "summaries",
        "counters"
      );
      const customerRef = doc(
        db,
        "organizations",
        orgId,
        "customers",
        customerId
      );
      const paymentId = newDocRef.id;

      await runTransaction(db, async (transaction) => {
        /**
         * get current customer data.
         * dont use submitted customer as data might be outdated
         */
        const [customerData] = await Promise.all([
          getCustomerData(transaction, orgId, customerId),
        ]);

        const paymentNumber = (customerData.summary?.payments || 0) + 1;
        const paymentSlug = `PR-${String(paymentNumber).padStart(6, 0)}`;

        // console.log({ latestPayment, paymentNumber, paymentSlug });
        /**
         * create the all inclusive payment data
         */
        const newDetails = {
          ...data,
          paymentId,
          status: "active",
          paymentNumber,
          paymentSlug,
          org,
          createdBy: email,
          createdAt: serverTimestamp(),
          modifiedBy: email,
          modifiedAt: serverTimestamp(),
        };
        const transactionDetails = formats.formatTransactionDetails(newDetails);
        // console.log({ transactionDetails });
        /**
         * start docs writing!
         */

        /**
         * increment orgs counter for payments by one(1)
         */
        transaction.update(countersRef, {
          payments: increment(1),
        });
        /**
         * update customer data
         * increment summary.payments counter by 1
         * increment summary.unusedCredits by the excess amount
         * increment summary.invoicePayments by the paymentsTotal amount
         */
        transaction.update(customerRef, {
          "summary.payments": increment(1),
          "summary.unusedCredits": increment(excess),
          "summary.invoicePayments": increment(paymentsTotal),
          modifiedAt: serverTimestamp(),
          modifiedBy: email,
        });
        /**
         * make the needed invoice payments
         */
        payInvoices(
          transaction,
          userProfile,
          orgId,
          transactionDetails,
          paymentsToCreate,
          accounts
        );
        /**
         * excess amount - credit account with the excess amount
         */
        if (excess > 0) {
          createSimilarAccountEntries(
            transaction,
            userProfile,
            orgId,
            unearned_revenue,
            [
              {
                account: unearned_revenue,
                amount: excess,
                reference,
                transactionId: paymentSlug,
                transactionDetails,
                transactionType: "customer payment",
              },
            ]
          );
        }
        /**
         * create new payment
         */
        const { paymentId: pid, ...tDetails } = newDetails;
        transaction.set(newDocRef, { ...tDetails });
      });
    }

    yield call(create);

    yield put(success());
    yield put(toastSuccess("Payment sucessfully created!"));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchCreatePayment() {
  yield takeLatest(CREATE_PAYMENT, createPayment);
}
