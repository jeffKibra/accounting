import {
  doc,
  collection,
  serverTimestamp,
  increment,
} from "firebase/firestore";

import { db } from "../firebase";
import { getIncomeAccountsMapping } from "../invoices";

import { createSimilarAccountEntries } from "../journals";
import { getAccountData } from "../accounts";
import formats from "../formats";
import { getDateDetails } from "../dates";

export default async function createSalesReceipt(
  transaction,
  org = { id: "" },
  userProfile = { email: "" },
  accounts = [{ name: "", accountd: "", accountType: {} }],
  salesReceiptSlug = "",
  data = {
    customerId: "",
    customer: {},
    summary: {
      shipping: 0,
      adjustment: 0,
      subTotal: 0,
      totalTaxes: 0,
      totalAmount: 0,
    },
    selectedItems: [
      {
        salesAccountId: "",
        salesAccount: { name: "", accountd: "", accountType: {} },
        totalAmount: 0,
      },
    ],
    receiptDate: new Date(),
    accountId: "",
    account: {},
    paymentModeId: "",
    paymentMode: {},
    reference: "",
    customerNotes: "",
  },
  transactionType = "salesReceipt"
) {
  const orgId = org.id;
  const { email } = userProfile;
  const { customerId, customer, summary, selectedItems, accountId, reference } =
    data;
  const { totalTaxes, adjustment, shipping, totalAmount } = summary;
  console.log({ data });
  /**
   * accounts details
   */
  const accounts_receivable = getAccountData("accounts_receivable", accounts);
  const tax_payable = getAccountData("tax_payable", accounts);
  const shipping_charge = getAccountData("shipping_charge", accounts);
  const other_charges = getAccountData("other_charges", accounts);
  const paymentAccount = getAccountData(accountId, accounts);

  const { yearMonthDay } = getDateDetails();
  const summaryRef = doc(db, "organizations", orgId, "summaries", yearMonthDay);

  const newDocRef = doc(
    collection(db, "organizations", orgId, "salesReceipts")
  );
  const salesReceiptId = newDocRef.id;

  // console.log({ selectedItems });

  const salesReceiptData = {
    ...data,
    status: "active",
    isSent: false,
    transactionType,
    salesReceiptSlug,
    org: formats.formatOrgData(org),
    customer: formats.formatCustomerData(customer),
    selectedItems: formats.formatInvoiceItems(selectedItems),
  };

  const transactionDetails = { ...salesReceiptData, salesReceiptId };
  const transactionId = salesReceiptSlug;

  /**
   * create journal entries for income accounts
   */
  const { newAccounts } = getIncomeAccountsMapping([], selectedItems);

  newAccounts.forEach((newAccount) => {
    const { accountId, incoming } = newAccount;
    const salesAccount = getAccountData(accountId, accounts);

    createSimilarAccountEntries(transaction, userProfile, orgId, salesAccount, [
      {
        amount: incoming,
        account: salesAccount,
        reference,
        transactionId,
        transactionType,
        transactionDetails,
      },
    ]);
  });
  // console.log({ summary });
  /**
   * journal entry for salesReceipt total => accounts_receivable
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
   * in case other transaction type is passed, dont create:
   * taxes, shipping and adjustment
   */
  if (transactionType === "salesReceipt") {
    /**
     * journal entry for taxes => tax_payable-liability account
     */
    if (totalTaxes > 0) {
      createSimilarAccountEntries(
        transaction,
        userProfile,
        orgId,
        tax_payable,
        [
          {
            amount: totalTaxes,
            account: tax_payable,
            reference,
            transactionId,
            transactionType,
            transactionDetails,
          },
        ]
      );
    }

    /**
     * shipping charge
     */
    if (shipping > 0) {
      createSimilarAccountEntries(
        transaction,
        userProfile,
        orgId,
        shipping_charge,
        [
          {
            amount: shipping,
            account: shipping_charge,
            reference,
            transactionId,
            transactionType,
            transactionDetails,
          },
        ]
      );
    }
    /**
     * adjustments
     */
    if (adjustment > 0 || adjustment < 0) {
      createSimilarAccountEntries(
        transaction,
        userProfile,
        orgId,
        other_charges,
        [
          {
            amount: adjustment,
            account: other_charges,
            reference,
            transactionDetails,
            transactionId,
            transactionType,
          },
        ]
      );
    }
    /**
     * update customer summaries if a customer was selected
     */
    if (customerId) {
      const customerRef = doc(
        db,
        "organizations",
        orgId,
        "customers",
        customerId
      );

      transaction.update(customerRef, {
        "summary.salesReceipts": increment(1),
        "summary.salesReceiptsAmount": increment(summary.totalAmount),
      });
    }
    /**
     * update org summaries
     */
    transaction.update(summaryRef, {
      salesReceipts: increment(1),
    });
  }
  /**
   * entry for the payment
   */
  createSimilarAccountEntries(transaction, userProfile, orgId, paymentAccount, [
    {
      amount: totalAmount,
      account: paymentAccount,
      reference,
      transactionDetails,
      transactionId,
      transactionType,
    },
  ]);
  /**
   * create salesReceipt
   */
  console.log({ salesReceiptData });
  transaction.set(newDocRef, {
    ...salesReceiptData,
    createdBy: email,
    createdAt: serverTimestamp(),
    modifiedBy: email,
    modifiedAt: serverTimestamp(),
  });
}
