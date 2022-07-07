import { PaymentTerm } from ".";

export interface CustomerSummary {
  companyName: string;
  customerId: string;
  displayName: string;
  email: string;
  type: string;
}

export interface CustomerFormData {
  billingCity: string;
  billingCountry: string;
  billingPostalCode: string;
  billingState: string;
  billingStreet: string;
  companyName: string;
  displayName: string;
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
  paymentTerm: PaymentTerm;
  paymentTermId: string;
  phone: string;
  remarks: string;
  salutation: string;
  shippingCity: string;
  shippingCountry: string;
  shippingPostalCode: string;
  shippingState: string;
  shippingStreet: string;
  type: string;
  website: string;
  openingBalance: number;
}

interface Meta {
  status: string;
  summary: {
    deletedInvoices: number;
    deletedPayments: number;
    invoicePayments: number;
    invoicedAmount: number;
    invoices: number;
    payments: number;
    unusedCredits: number;
  };
  createdAt: string;
  createdBy: string;
  modifiedAt: string;
  modifiedBy: string;
}

export interface CustomerFormDataWithId extends CustomerFormData {
  customerId: string;
}

export interface CustomerFromDb extends CustomerFormData, Meta {}

export interface Customer extends CustomerFromDb {
  customerId: string;
}

export interface CustomerToUpdate
  extends Omit<
    CustomerFromDb,
    "createdAt" | "createdBy" | "summary" | "status"
  > {
  status?: string;
}

export interface OpeningBalanceFormData {
  openingBalance: number;
  customerId: string;
}
