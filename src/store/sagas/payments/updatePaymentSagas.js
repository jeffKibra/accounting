import { put, call, select, takeLatest } from "redux-saga/effects";
import { doc, serverTimestamp, runTransaction } from "firebase/firestore";

import {
  deleteSimilarAccountEntries,
  updateSimilarAccountEntries,
  changeEntriesAccount,
} from "../../../utils/journals";
import {
  getPaymentsTotal,
  getPaymentData,
  getPaymentEntriesToUpdate,
  getPaymentsMapping,
  updateCustomersPayments,
  updateInvoicesPayments,
  payInvoices,
  deleteInvoicesPayments,
  overPay,
  getPaymentEntry,
  combineInvoices,
} from "../../../utils/payments";
import { getAccountData } from "../../../utils/accounts";
import {
  createDailySummary,
  changePaymentMode,
  updatePaymentMode,
} from "../../../utils/summaries";
import formats from "../../../utils/formats";

import { db } from "../../../utils/firebase";
import { UPDATE_PAYMENT } from "../../actions/paymentsActions";
import { start, success, fail } from "../../slices/paymentsSlice";
import {
  error as toastError,
  success as toastSuccess,
} from "../../slices/toastSlice";

function* updatePayment({ data }) {
  yield put(start(UPDATE_PAYMENT));

  try {
    const org = yield select((state) => state.orgsReducer.org);
    const orgId = org.id;
    const userProfile = yield select((state) => state.authReducer.userProfile);
    const { email } = userProfile;
    const accounts = yield select((state) => state.accountsReducer.accounts);
    // console.log({ data, orgId, userProfile });
    const {
      paymentId,
      payments,
      paidInvoices,
      customerId,
      amount,
      accountId,
      reference,
      paymentModeId,
    } = data;
    /**
     * get payments total
     */
    const paymentsTotal = getPaymentsTotal(payments);
    if (paymentsTotal > amount) {
      throw new Error(
        "Invoices payments cannot be more than customer payment!"
      );
    }
    /**
     * compute excess amount if any
     */
    const excess = amount - paymentsTotal;

    //accounts data
    const unearned_revenue = getAccountData("unearned_revenue", accounts);
    const accounts_receivable = getAccountData("accounts_receivable", accounts);
    const depositAccount = getAccountData(accountId, accounts);

    async function update() {
      const paymentRef = doc(db, "organizations", orgId, "payments", paymentId);

      await runTransaction(db, async (transaction) => {
        /**
         * get current currentPayment and incoming customer details
         * create daily summary since all updates also update the summary
         */
        const [currentPayment] = await Promise.all([
          getPaymentData(transaction, orgId, paymentId),
          createDailySummary(orgId),
        ]);
        /**
         * check if the customer has changed. if yes
         * generate new payment number and slug
         */
        const customerHasChanged = customerId !== currentPayment.customerId;

        const allInvoices = combineInvoices(
          [...currentPayment.paidInvoices],
          [...paidInvoices]
        );

        if (customerHasChanged) {
          console.log("customer has changed");
        }
        /**
         * check if payment account has been changed
         */
        const paymentAccountHasChanged = accountId !== currentPayment.accountId;

        const {
          similarPayments,
          paymentsToUpdate,
          paymentsToCreate,
          paymentsToDelete,
        } = getPaymentsMapping(currentPayment.payments, payments);
        // console.log({
        //   similarPayments,
        //   paymentsToUpdate,
        //   paymentsToCreate,
        //   paymentsToDelete,
        // });
        /**
         * create two different update values based on the accounts:
         * 1. accountsReceivable account
         * 2. deposit account
         * if either customer or deposit account has changed:
         * values include paymentsToUpdate and similarPayments
         * else, paymentsToUpdate only
         */
        const accountsReceivablePaymentsToUpdate = customerHasChanged
          ? [...paymentsToUpdate, ...similarPayments]
          : paymentsToUpdate;
        const accountPaymentsToUpdate =
          customerHasChanged || paymentAccountHasChanged
            ? [...paymentsToUpdate, ...similarPayments]
            : paymentsToUpdate;
        /**
         * divide the payments entries into:
         * 1. accounts_receivable account
         * 2. selected paymentAccount
         * get entries for each payments that needs updating
         */
        const [
          paymentAccountEntries,
          paymentAccountEntriesToDelete,
          accountsReceivableEntries,
          accountsReceivableEntriesToDelete,
          overPayEntry,
        ] = await Promise.all([
          getPaymentEntriesToUpdate(
            orgId,
            paymentId,
            [...allInvoices],
            currentPayment.accountId, //use current payment accountId
            [...accountPaymentsToUpdate]
          ),
          getPaymentEntriesToUpdate(
            orgId,
            paymentId,
            [...allInvoices],
            currentPayment.accountId,
            [...paymentsToDelete]
          ),
          getPaymentEntriesToUpdate(
            orgId,
            paymentId,
            [...allInvoices],
            accounts_receivable.accountId,
            [...accountsReceivablePaymentsToUpdate]
          ),
          getPaymentEntriesToUpdate(
            orgId,
            paymentId,
            [...allInvoices],
            accounts_receivable.accountId,
            [...paymentsToDelete]
          ),
          getPaymentEntry(
            orgId,
            paymentId,
            unearned_revenue.accountId,
            paymentId
          ),
        ]);

        // console.log({
        //   paymentAccountEntries,
        //   paymentAccountEntriesToDelete,
        //   accountsReceivableEntries,
        //   accountsReceivableEntriesToDelete,
        //   overPayEntry,
        // });
        /**
         * start docs writing!
         */
        const transactionDetails = formats.formatTransactionDetails({
          ...data,
          paidInvoicesIds: paidInvoices.map((invoice) => invoice.invoiceId),
          excess,
          paymentId,
          status: "active",
        });
        // console.log({ transactionDetails });
        const newDetails = {
          ...transactionDetails,
          modifiedBy: email,
          modifiedAt: serverTimestamp(),
        };
        /**
         * update customers
         * function also handles a change of customer situation.
         */
        updateCustomersPayments(
          transaction,
          orgId,
          userProfile,
          currentPayment,
          newDetails
        );
        /**
         * update invoices
         * 1. update the necessary invoice payments
         * 2. updates accountsReceivableEntries for the updated payments
         * 3. updates paymentAccount entries fro the same
         */
        updateInvoicesPayments(
          transaction,
          userProfile,
          orgId,
          { ...transactionDetails },
          [...paymentsToUpdate]
        );
        /**2
         * update accounts receivable entries
         * they are not factored in if deposit account has changed
         * NOTE:::pass income as a negative value to be credited
         */
        updateSimilarAccountEntries(
          transaction,
          userProfile,
          orgId,
          accounts_receivable,
          accountsReceivableEntries.map((entry) => {
            const {
              incoming,
              entry: { credit, debit, entryId },
              invoice,
            } = entry;
            return {
              account: accounts_receivable,
              amount: 0 - incoming,
              credit,
              debit,
              entryId,
              transactionId: invoice.invoiceId,
              transactionDetails,
            };
          })
        );
        /**3
         * check is paymentAccountId has changed
         */
        if (paymentAccountHasChanged) {
          /**
           * change the entries details and update associated accounts
           */
          console.log("account has changed");
          changeEntriesAccount(
            transaction,
            userProfile,
            orgId,
            currentPayment.account,
            depositAccount,
            paymentAccountEntries.map((entry) => {
              const { invoice, incoming } = entry;
              return {
                amount: incoming,
                prevAccount: currentPayment.account,
                prevEntry: entry.entry,
                transactionDetails,
                transactionId: invoice.invoiceId,
                transactionType: "customer payment",
                reference,
              };
            })
          );
        } else {
          /**
           * do a normal update
           */
          console.log("normal update");
          updateSimilarAccountEntries(
            transaction,
            userProfile,
            orgId,
            depositAccount,
            paymentAccountEntries.map((entry) => {
              const {
                entry: { credit, debit, entryId },
                incoming,
                invoice,
              } = entry;
              return {
                account: depositAccount,
                amount: incoming,
                credit,
                debit,
                entryId,
                transactionId: invoice.invoiceId,
                transactionDetails,
              };
            })
          );
        }
        /**
         * create new invoice payments if any
         * the function also creates all the necessary journal entries
         */
        if (paymentsToCreate.length > 0) {
          console.log("creating payments");
          payInvoices(
            transaction,
            userProfile,
            orgId,
            transactionDetails,
            paymentsToCreate,
            accounts
          );
        }
        /**
         * delete deleted payments
         * 1. delete payments in invoices
         * 2. delete paymentAccount entries
         * 3. delete accountsReceivable entries
         */
        if (paymentsToDelete.length > 0) {
          console.log("deleting payments");
          deleteInvoicesPayments(
            transaction,
            userProfile,
            orgId,
            currentPayment,
            paymentsToDelete,
            allInvoices
          );
        }
        if (paymentAccountEntriesToDelete.length > 0) {
          console.log("deleting deposit account entries");

          deleteSimilarAccountEntries(
            transaction,
            userProfile,
            orgId,
            currentPayment.account,
            paymentAccountEntriesToDelete.map((entry) => {
              const {
                entry: { credit, debit, entryId },
              } = entry;
              return {
                account: currentPayment.account,
                credit,
                debit,
                entryId,
              };
            })
          );
        }
        if (accountsReceivableEntriesToDelete.length > 0) {
          console.log("deleting accounts_receivebale entries");

          deleteSimilarAccountEntries(
            transaction,
            userProfile,
            orgId,
            accounts_receivable,
            accountsReceivableEntriesToDelete.map((entry) => {
              const {
                entry: { credit, debit, entryId },
              } = entry;
              return {
                account: accounts_receivable,
                credit,
                debit,
                entryId,
              };
            })
          );
        }
        /**
         * excess amount - credit account with the excess amount
         */
        if (overPayEntry) {
          console.log("updating overpayment");

          overPay.updateEntry(
            transaction,
            userProfile,
            orgId,
            excess,
            transactionDetails,
            overPayEntry,
            accounts
          );
        } else {
          if (excess > 0) {
            console.log("creating overpayment");

            overPay.createEntry(
              transaction,
              userProfile,
              orgId,
              excess,
              transactionDetails,
              accounts
            );
          }
        }
        /**
         * update summary payment modes
         * if mode has changed, change the mode values
         */
        if (currentPayment.paymentModeId === paymentModeId) {
          if (currentPayment.amount !== amount) {
            /**
             * create adjustment by subtracting current amount from incoming amount
             */
            const modeAdjustment = amount - currentPayment.amount;
            updatePaymentMode(
              transaction,
              orgId,
              paymentModeId,
              modeAdjustment
            );
          }
        } else {
          /**
           * payment modes are not the same
           */
          changePaymentMode(transaction, orgId, currentPayment, data);
        }
        /**
         * update payment
         */
        const { paymentId: pid, org, ...tDetails } = newDetails;
        // console.log({ tDetails });
        transaction.update(paymentRef, { ...tDetails });
      });
    }

    yield call(update);

    yield put(success());
    yield put(toastSuccess("Payment sucessfully updated!"));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchUpdatePayment() {
  yield takeLatest(UPDATE_PAYMENT, updatePayment);
}
