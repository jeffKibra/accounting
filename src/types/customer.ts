import { Timestamp } from 'firebase/firestore';
import { PaymentTerm } from '.';

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
  createdAt: Date | Timestamp;
  createdBy: string;
  modifiedAt: Date | Timestamp;
  modifiedBy: string;
}

export interface CustomerFromDb extends CustomerFormData, Meta {}

export interface Customer extends CustomerFromDb {
  customerId: string;
}
