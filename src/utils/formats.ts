import { Timestamp } from 'firebase/firestore';
import {
  IInvoice,
  PaymentReceived,
  IOrg,
  IContact,
  IContactSummary,
} from '../types';

function formatCustomerData(customer: IContact): IContactSummary {
  const { displayName, _id } = customer;

  return { displayName, _id };
}

// function formatVendorData(vendor: IContact): IContactSummary {
//   const { displayName, email, id, contactType, type } = vendor;

//   return { displayName, email, id, contactType, type };
// }

function formatInvoices(invoices: IInvoice[]) {
  return invoices.map(invoice => {
    const {
      saleDate,
      dueDate,
      // bookingTotal,
      // transferAmount,
      total,
      // status,
      _id: invoiceId,
      balance,
      // transactionType,
    } = invoice;
    return {
      saleDate,
      dueDate,
      // bookingTotal,
      // transferAmount,
      total,
      // status,
      invoiceId,
      balance,
      // transactionType,
    };
  });
}

function formatInvoicePayment(payment: PaymentReceived) {
  const { paymentDate, reference, paymentMode, account, amount, paymentId } =
    payment;

  return {
    paymentDate,
    reference,
    paymentMode,
    account,
    amount,
    paymentId,
  };
}

function formatOrgData(org: IOrg) {
  const { _id: orgId, businessType, name } = org;

  return { orgId, businessType, name };
}

interface TransactionDetails {
  createdAt?: Date | Timestamp;
  createdBy?: string;
  modifiedAt: Date | Timestamp;
  modifiedBy?: string;
  customer: IContact;
  paidInvoices: IInvoice[];
  org: IOrg;
  [key: string]: unknown;
}

function formatTransactionDetails(details: TransactionDetails) {
  const { createdAt, createdBy, modifiedAt, modifiedBy, ...rest } = details;
  const { customer, org, paidInvoices } = rest;
  return {
    ...rest,
    customer: formatCustomerData(customer),
    paidInvoices: formatInvoices(paidInvoices),
    ...(org ? { org: formatOrgData(org) } : {}),
  };
}

function formatCash(num: number) {
  return Number(Number(num).toFixed(2)).toLocaleString();
}

const formats = {
  formatInvoices,
  formatInvoicePayment,
  formatCustomerData,
  formatOrgData,
  formatTransactionDetails,
  formatCash,
};

export default formats;
