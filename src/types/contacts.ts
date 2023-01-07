import { FieldValue } from 'firebase/firestore';
import { PaymentTerm } from '.';

export interface IContactForm {
  contactType: 'customer' | 'vendor';
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
  billingCity: string;
  billingCountry: string;
  billingPostalCode: string;
  billingState: string;
  billingStreet: string;
  shippingCity: string;
  shippingCountry: string;
  shippingPostalCode: string;
  shippingState: string;
  shippingStreet: string;
  type: 'individual' | 'company';
  website: string;
  openingBalance: number;
}

interface IMeta {
  status: number;
  createdAt: Date | FieldValue;
  createdBy: string;
  modifiedAt: Date | FieldValue;
  modifiedBy: string;
}

export interface IContactFromDb
  extends Omit<IContactForm, 'openingBalance'>,
    IMeta {
  openingBalance: {
    amount: number;
    transactionId: string;
  };
  contactType: 'customer' | 'vendor';
}

export interface IContact extends IContactFromDb {
  id: string;
}

//eslint-disable-next-line
export interface IContactSummary
  extends Pick<
    IContact,
    'companyName' | 'displayName' | 'email' | 'contactType' | 'type' | 'id'
  > {}
