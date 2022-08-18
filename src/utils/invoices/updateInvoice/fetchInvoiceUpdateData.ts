import { getAccountsEntriesForTransaction } from '../../journals';
import {
  getInvoiceData,
  getInvoicePaymentsTotal,
  mapInvoiceAccounts,
} from '..';

import { Transaction } from 'firebase/firestore';
import { InvoiceFormData } from '../../../types';

export default async function getInvoiceUpdateData(
  transaction: Transaction,
  orgId: string,
  invoiceId: string,
  incomingInvoice: InvoiceFormData
) {
  console.log({ incomingInvoice });
  const { summary, customer } = incomingInvoice;
  const { customerId } = customer;
  // console.log({ data });
  const { totalAmount } = summary;

  const [currentInvoice] = await Promise.all([
    getInvoiceData(transaction, orgId, invoiceId),
  ]);

  const {
    customer: { customerId: currentCustomerId },
    paymentsReceived,
    transactionType,
  } = currentInvoice;
  /**
   * check to ensure the new total balance is not less than payments made.
   */
  const paymentsTotal = getInvoicePaymentsTotal(paymentsReceived || {});
  /**
   * trying to update invoice total with an amount less than paymentsTotal
   * throw an error
   */
  if (paymentsTotal > totalAmount) {
    throw new Error(
      `Invoice Update Failed! The new Invoice Total is less than the invoice payments. If you are sure you want to edit, delete the associated payments or adjust them to be less than or equal to the new invoice total`
    );
  }
  /**
   * check if customer has been changed
   */
  const customerHasChanged = currentCustomerId !== customerId;
  /**
   * customer cannot be changed if the invoice has some payments made to it
   */
  if (paymentsTotal > 0 && customerHasChanged) {
    throw new Error(
      `CUSTOMER cannot be changed in an invoice that has payments! This is because all the payments are from the PREVIOUS customer. If you are sure you want to change the customer, DELETE the associated payments first!`
    );
  }

  const { deletedAccounts, newAccounts, updatedAccounts } = mapInvoiceAccounts(
    currentInvoice,
    incomingInvoice
  );
  console.log({ deletedAccounts, newAccounts, updatedAccounts });
  /**
   * get entries data for deletedAccounts and accountsToUpdate
   */
  const [entriesToUpdate, entriesToDelete] = await Promise.all([
    getAccountsEntriesForTransaction(
      orgId,
      invoiceId,
      transactionType,
      updatedAccounts
    ),
    getAccountsEntriesForTransaction(
      orgId,
      invoiceId,
      transactionType,
      deletedAccounts
    ),
  ]);

  return {
    currentInvoice,
    entriesToDelete,
    entriesToUpdate,
    newAccounts,
  };
}
