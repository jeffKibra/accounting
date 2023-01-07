import { Timestamp } from 'firebase/firestore';
import {
  Invoice,
  PaymentReceived,
  Org,
  IContact,
  IContactSummary,
} from '../types';

function formatCustomerData(customer: IContact): IContactSummary {
  const { displayName, type, companyName, email, id, contactType } = customer;

  return { displayName, type, companyName, email, id, contactType };
}

function formatVendorData(vendor: IContact): IContactSummary {
  const { displayName, companyName, email, id, contactType, type } = vendor;

  return { displayName, companyName, email, id, contactType, type };
}

function formatInvoices(invoices: Invoice[]) {
  return invoices.map(invoice => {
    const {
      invoiceDate,
      dueDate,
      summary,
      status,
      invoiceId,
      balance,
      transactionType,
    } = invoice;
    return {
      invoiceDate,
      dueDate,
      summary,
      status,
      invoiceId,
      balance,
      transactionType,
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

function formatOrgData(org: Org) {
  const { orgId, businessType, name } = org;

  return { orgId, businessType, name };
}

interface TransactionDetails {
  createdAt?: Date | Timestamp;
  createdBy?: string;
  modifiedAt: Date | Timestamp;
  modifiedBy?: string;
  customer: IContact;
  paidInvoices: Invoice[];
  org: Org;
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
  formatVendorData,
  formatCash,
};

export default formats;
