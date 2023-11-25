import {
  doc,
  serverTimestamp,
  increment,
  Transaction,
} from 'firebase/firestore';

import { db } from '../firebase';
// import { createSimilarAccountEntries } from "../journals";
// import { getAccountData } from "../accounts";
// import { createInvoice } from "../invoices";
import { getDateDetails } from '../dates';

import { UserProfile, IOrg, IAccount, IContactForm } from '../../types';

export default async function createVendor(
  transaction: Transaction,
  org: IOrg,
  userProfile: UserProfile,
  accounts: IAccount[],
  vendorId: string,
  vendorData: IContactForm
) {
  const { _id: orgId } = org;
  const { email } = userProfile;
  const vendorRef = doc(db, 'organizations', orgId, 'vendors', vendorId);
  const { yearMonthDay } = getDateDetails();
  const summaryRef = doc(db, 'organizations', orgId, 'summaries', yearMonthDay);

  const transactionDetails = {
    ...vendorData,
    vendorId,
    status: 'active',
    summary: {
      expenses: 0,
      deletedExpenses: 0,
      bills: 0,
      deletedBills: 0,
      payments: 0,
      deletedPayments: 0,
      totalExpenses: 0,
      totalPayments: 0,
      totalBills: 0,
      unusedCredits: 0,
    },
  };

  transaction.update(summaryRef, {
    vendors: increment(1),
  });

  /**
   * create vendor
   */
  const { vendorId: vid, ...tDetails } = transactionDetails;
  transaction.set(vendorRef, {
    ...tDetails,
    createdBy: email,
    createdAt: serverTimestamp(),
    modifiedBy: email,
    modifiedAt: serverTimestamp(),
  });
}

/**
 * if opening balance is greater than zero
 * create journal entries and an equivalent invoice
 */
// if (openingBalance > 0) {
//   /**
//    * create 2 journal entries
//    * 1. debit sales accountType= opening balance
//    * 2. credit opening_balance_adjustments accountType= opening balance
//    */
//   /**
//    * 1. debit sales
//    * to debit income, amount must be negative
//    */
//   const sales = getAccountData("sales", accounts);
//   createSimilarAccountEntries(transaction, userProfile, orgId, sales, [
//     {
//       amount: 0 - openingBalance,
//       account: sales,
//       reference: "",
//       transactionDetails,
//       transactionId: vendorId,
//       transactionType: "opening balance",
//     },
//   ]);
//   /**
//    * 2. credit opening_balance_adjustments entry for vendor opening balance
//    */
//   const obAdjustments = getAccountData("opening_balance_adjustments", accounts);
//   createSimilarAccountEntries(transaction, userProfile, orgId, obAdjustments, [
//     {
//       amount: +openingBalance,
//       account: obAdjustments,
//       reference: "",
//       transactionDetails,
//       transactionId: vendorId,
//       transactionType: "opening balance",
//     },
//   ]);
//   /**
//    * create an invoice equivalent for for vendor opening balance
//    */
//   const salesAccount = getAccountData("sales", accounts);
//   await createInvoice(
//     transaction,
//     org,
//     userProfile,
//     accounts,
//     vendorId,
//     {
//       vendorId,
//       vendor: transactionDetails,
//       invoiceDate: serverTimestamp(),
//       dueDate: serverTimestamp(),
//       paymentTerm,
//       paymentTermId,
//       summary: {
//         shipping: 0,
//         adjustment: 0,
//         subTotal: 0,
//         totalTax: 0,
//         totalAmount: openingBalance,
//       },
//       selectedItems: [
//         {
//           salesAccount,
//           salesAccountId: salesAccount.accountId,
//           totalAmount: openingBalance,
//         },
//       ],
//     },
//     "vendor opening balance"
//   );
// }
