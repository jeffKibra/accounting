import {
  OrgSummary,
  CustomerSummary,
  CustomerFormDataWithId,
  PaymentTerm,
  SalesItem,
  SalesSummary,
  PaymentMode,
  Account,
  SalesItemFromForm,
} from ".";
import { Timestamp } from "firebase/firestore";

export interface InvoicePayment {
  account: Account;
  amount?: number;
  customerId: string;
  excess: number;
  paidInvoicesIds: string[];
  paymentAmount: number;
  paymentDate: Date | Timestamp;
  paymentId: string;
  paymentMode: PaymentMode;
  paymentModeId: string;
  payments: { [key: string]: number };
  reference: string;
  status: string;
}

export interface InvoicePayments {
  [key: string]: InvoicePayment;
}

interface Meta {
  transactionType: string;
  balance: number;
  isSent: boolean;
  paymentsCount: number;
  paymentsIds: string[];
  payments: InvoicePayments;
  status: string;
  org: OrgSummary;
  createdAt: Date;
  createdBy: string;
  modifiedAt: Date;
  modifiedBy: string;
}

export interface InvoiceFormData {
  customerId: string;
  customer: CustomerFormDataWithId;
  customerNotes: string;
  dueDate: Date;
  invoiceDate: Date;
  orderNumber: string;
  paymentTermId: string;
  paymentTerm: PaymentTerm;
  subject: string;
  selectedItems: SalesItemFromForm[];
  summary: SalesSummary;
}

export interface InvoiceFormWithId extends InvoiceFormData {
  invoiceId: string;
}

export interface InvoiceUpdateData extends Partial<InvoiceFormWithId> {
  customerId: string;
  customer: CustomerFormDataWithId;
  selectedItems: SalesItemFromForm[];
  summary: SalesSummary;
  invoiceId: string;
}

export interface InvoiceFromDb
  extends Omit<InvoiceFormData, "customer" | "selectedItems">,
    Meta {
  customer: CustomerSummary;
  selectedItems: SalesItem[];
}

export interface Invoice extends InvoiceFromDb {
  invoiceId: string;
}

export interface InvoiceSummary {
  balance: number;
  dueDate: Date;
  invoiceDate: Date;
  invoiceId: string;
  status: string;
  transactionType: string;
  summary: SalesSummary;
}
