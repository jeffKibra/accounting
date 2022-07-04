import {
  OrgSummary,
  CustomerSummary,
  PaymentTerm,
  SalesItem,
  SalesSummary,
} from ".";

export interface Invoice {
  balance: number;
  createdAt: Date;
  createdBy: string;
  customerId: string;
  customer: CustomerSummary;
  customerNotes: string;
  dueDate: Date;
  invoiceDate: Date;
  isSent: boolean;
  modifiedAt: Date;
  modifiedBy: string;
  orderNumber: string;
  paymentTermId: string;
  paymentTerm: PaymentTerm;
  paymentsCount: number;
  paymentsIds: string[];
  payments: {};
  status: string;
  subject: string;
  transactionType: string;
  org: OrgSummary;
  selectedItems: SalesItem[];
  summary: SalesSummary;
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
