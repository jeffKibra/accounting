import { doc, serverTimestamp, increment } from "firebase/firestore";

import { db } from "../firebase";
import {
  deleteSimilarAccountEntries,
  groupEntriesIntoAccounts,
} from "../journals";
import {
  getPaymentsTotal,
  getPaymentData,
  getPaymentsMapping,
  deleteInvoicesPayments,
  getAllPaymentEntries,
} from "../payments";
import { getDateDetails } from "../dates";

export default async function deletePayment(
  transaction,
  orgId,
  userProfile,
  paymentId
) {
  const { email } = userProfile;
  // console.log({ paymentId });

  // const invoicesIds = Object.keys(payments);

  const paymentRef = doc(db, "organizations", orgId, "payments", paymentId);
  const { yearMonthDay } = getDateDetails();
  const summaryRef = doc(db, "organizations", orgId, "summaries", yearMonthDay);

  /**
   * get current paymentData and incoming customer details
   */
  const [paymentData, allEntries] = await Promise.all([
    getPaymentData(transaction, orgId, paymentId),
    getAllPaymentEntries(orgId, paymentId),
  ]);
  const { customerId, payments, excess, amount, paymentModeId } = paymentData;
  const paymentsTotal = getPaymentsTotal(payments);
  // console.log({ allEntries });
  /**
   * group entries into accounts
   */
  const groupedEntries = groupEntriesIntoAccounts(allEntries);
  // console.log({ groupedEntries });

  const { paymentsToDelete } = getPaymentsMapping(payments, {});
  // console.log({
  //   paymentsToDelete,
  // });

  /**
   * start docs writing!
   */

  /**
   * delete entries
   */
  groupedEntries.forEach((group) => {
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
   * delete deleted payments from linked invoices
   */
  if (paymentsToDelete.length > 0) {
    // console.log("deleting i");
    deleteInvoicesPayments(
      transaction,
      userProfile,
      orgId,
      paymentData,
      paymentsToDelete
    );
  }
  /**
   * update customers
   * function also handles a change of customer situation.
   */
  const customerRef = doc(db, "organizations", orgId, "customers", customerId);
  transaction.update(customerRef, {
    "summary.deletedPayments": increment(1),
    "summary.unusedCredits": increment(0 - excess),
    "summary.invoicePayments": increment(0 - paymentsTotal),
    modifiedAt: serverTimestamp(),
    modifiedBy: email,
  });
  /**
   * update summary- increase deletedPayments by one
   * adjust payment mode value by negative of payment amount
   */
  transaction.update(summaryRef, {
    deletedPayments: increment(1),
    [`paymentModes.${paymentModeId}`]: increment(0 - amount),
  });
  /**
   * mark payment as deleted
   */
  transaction.update(paymentRef, {
    status: "deleted",
    modifiedAt: serverTimestamp(),
    modifiedBy: email,
  });
}
