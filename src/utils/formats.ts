import { Timestamp } from "firebase/firestore";
import {
  Customer,
  CustomerSummary,
  Vendor,
  Invoice,
  PaymentReceived,
  Org,
  SalesItem,
  ExpenseItem,
  SalesItemFromForm,
  VendorSummary,
} from "../types";

function formatCustomerData(customer: Customer): CustomerSummary {
  const { displayName, type, companyName, email, customerId } = customer;

  return { displayName, type, companyName, email, customerId };
}

function formatVendorData(vendor: Vendor): VendorSummary {
  const { displayName, companyName, email, vendorId } = vendor;

  return { displayName, companyName, email, vendorId };
}

function formatInvoices(invoices: Invoice[]) {
  return invoices.map((invoice) => {
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
  customer: Customer;
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

function formatSaleItems(items: SalesItemFromForm[]): SalesItem[] {
  return items.map((item) => {
    const {
      createdAt,
      createdBy,
      modifiedBy,
      modifiedAt,
      extraDetails,
      status,
      salesAccountId,
      salesTaxId,
      ...rest
    } = item;

    return { ...rest };
  });
}

function formatExpenseItems(items: ExpenseItem[]) {
  return items.map((item) => {
    return item;
  });
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
  formatSaleItems,
  formatExpenseItems,
  formatVendorData,
  formatCash,
};

export default formats;
