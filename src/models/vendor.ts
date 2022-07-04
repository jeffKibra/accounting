import { PaymentTerm } from ".";

export interface Vendor {
  billingCity: string;
  billingCountry: string;
  billingPostalCode: string;
  billingState: string;
  billingStreet: string;
  companyName: string;
  createdAt: Date;
  createdBy: string;
  displayName: string;
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
  modifiedAt: Date;
  modifiedBy: string;
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
  website: string;
}
