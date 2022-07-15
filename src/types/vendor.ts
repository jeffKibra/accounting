import { PaymentTerm } from ".";

export interface VendorSummary {
  displayName: string;
  companyName: string;
  email: string;
  vendorId: string;
}

interface Meta {
  createdAt: Date;
  createdBy: string;
  modifiedAt: Date;
  modifiedBy: string;
  status: string;
  summary: {
    bills: number;
    deletedBills: number;
    deletedExpenses: number;
    deletedPayments: number;
    expenses: number;
    payments: number;
    totalBills: number;
    totalExpenses: number;
    totalPayments: number;
    unusedCredits: number;
  };
}

export interface VendorFormData {
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
  phone: string;
  remarks: string;
  salutation: string;
  shippingCity: string;
  shippingCountry: string;
  shippingPostalCode: string;
  shippingState: string;
  shippingStreet: string;
  website: string;
}

export interface VendorFromDb extends VendorFormData, Meta {}

export interface Vendor extends VendorFromDb {
  vendorId: string;
}
