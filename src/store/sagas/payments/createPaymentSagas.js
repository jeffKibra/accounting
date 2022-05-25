import { put, call, select, takeLatest } from "redux-saga/effects";
import {
  doc,
  collection,
  serverTimestamp,
  runTransaction,
  increment,
} from "firebase/firestore";

import { assetEntry, liabilityEntry } from "../journals";

import { db } from "../../../utils/firebase";
import { CREATE_PAYMENT } from "../../actions/paymentsActions";
import { start, success, fail } from "../../slices/paymentsSlice";
import {
  error as toastError,
  success as toastSuccess,
} from "../../slices/toastSlice";

function* createPayment({ data }) {
  yield put(start(CREATE_PAYMENT));
  try {
    const org = yield select((state) => state.orgsReducer.org);
    const orgId = org.id;
    const userProfile = yield select((state) => state.authReducer.userProfile);
    const { email } = userProfile;
    const allAccounts = yield select((state) => state.accountsReducer.accounts);
    // console.log({ data, orgId, userProfile });
    const { payments, customerId, amount, accountId, reference } = data;
    console.log({ payments });
    Object.keys(payments).forEach((key) => {
      const value = payments[key];
      if (value === 0) {
        delete payments[key];
      }
    });
    console.log({ payments });
    const invoicesIds = Object.keys(payments);
    const paymentsTotal = invoicesIds.reduce((sum, id) => {
      return sum + payments[id];
    }, 0);

    if (paymentsTotal > amount) {
      throw new Error(
        "Invoices payments cannot be more than customer payment!"
      );
    }
    const excess = amount - paymentsTotal;
    console.log({ paymentsTotal, excess });

    function getAccount(accountId) {
      const found = allAccounts.find(
        (account) => account.accountId === accountId
      );

      if (!found) {
        throw new Error(
          `Journal entries data for account ${accountId} not found!`
        );
      }
      const { accountType, name } = found;
      return {
        name,
        accountId,
        accountType,
      };
    }

    //accounts data
    const accounts_receivable = getAccount("accounts_receivable");
    const paymentAccount = getAccount(accountId);
    const unearned_revenue = getAccount("unearned_revenue");

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

      await runTransaction(db, async (transaction) => {
        const [customerDoc, invoices] = await Promise.all([
          transaction.get(customerRef),
          Promise.all(
            invoicesIds.map(async (invoiceId) => {
              const invoiceRef = doc(
                db,
                "organizations",
                orgId,
                "invoices",
                invoiceId
              );

              const invoiceDoc = await transaction.get(invoiceRef);
              if (!invoiceDoc.exists) {
                throw new Error("Invoice data not found!");
              }

              const { org, customer, ...invoiceData } = invoiceDoc.data();

              return {
                ...invoiceData,
                invoiceId,
              };
            })
          ),
        ]);

        if (!customerDoc.exists) {
          throw new Error("Customer data not found!");
        }
        const paymentNumber = (customerDoc.data().summary?.payments || 0) + 1;
        const paymentSlug = `PR-${String(paymentNumber).padStart(6, 0)}`;

        // console.log({ latestPayment, paymentNumber, paymentSlug });
        /**
         * start docs writing!
         */
        const transactionDetails = {
          ...data,
          invoices,
          status: "active",
          paymentNumber,
          paymentSlug,
          org,
          createdBy: email,
          createdAt: serverTimestamp(),
          modifiedBy: email,
          modifiedAt: serverTimestamp(),
        };
        console.log({ transactionDetails });

        transaction.update(countersRef, {
          payments: increment(1),
        });

        transaction.update(customerRef, {
          "summary.payments": increment(1),
          "summary.unusedCredits": increment(excess),
          "summary.invoicePayments": increment(paymentsTotal),
          modifiedAt: serverTimestamp(),
          modifiedBy: email,
        });

        // update invoices
        invoices.forEach((invoice) => {
          const { invoiceId, ...invoiceData } = invoice;
          const invoiceRef = doc(
            db,
            "organizations",
            orgId,
            "invoices",
            invoiceId
          );
          const paymentAmount = payments[invoiceId];
          console.log({ paymentAmount });

          if (paymentAmount > 0) {
            //update invoice
            transaction.update(invoiceRef, {
              "summary.balance": increment(paymentAmount),
              payments: {
                ...invoiceData.payments,
                [newDocRef.id]: paymentAmount,
              },
              modifiedBy: email,
              modifiedAt: serverTimestamp(),
            });

            const { invoiceSlug } = invoiceData;

            /**
             * create journal entries
             * debit selected account
             */
            assetEntry.newEntry(
              transaction,
              userProfile,
              orgId,
              paymentAccount.accountId,
              {
                amount: paymentAmount,
                account: paymentAccount,
                reference,
                transactionId: invoiceSlug,
                transactionType: "customer payment",
                transactionDetails,
              }
            );
            //credit accounts receivable- make amount negative to credit it
            assetEntry.newEntry(
              transaction,
              userProfile,
              orgId,
              accounts_receivable.accountId,
              {
                amount: 0 - paymentAmount,
                reference,
                account: accounts_receivable,
                transactionId: invoiceSlug,
                transactionType: "customer payment",
                transactionDetails,
              }
            );
          }
        });

        //excess amount - credit account with the excess amount
        if (excess > 0) {
          liabilityEntry.newEntry(
            transaction,
            userProfile,
            orgId,
            unearned_revenue.accountId,
            {
              amount: excess,
              reference,
              account: unearned_revenue,
              transactionId: paymentSlug,
              transactionType: "customer payment",
              transactionDetails,
            }
          );
        }

        transaction.set(newDocRef, { ...transactionDetails }, { merge: true });
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
