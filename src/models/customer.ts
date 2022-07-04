export interface CustomerSummary {
  companyName: string;
  customerId: string;
  displayName: string;
  email: string;
  type: string;
}

export interface Customer {
  billingCity: string;
  billingCountry: string;
  billingPostalCode: string;
  billingState: string;
  billingStreet: string;
  companyName: string;
  createdAt: string;
  createdBy: string;
  displayName: string;
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
  modifiedAt: string;
  modifiedBy: string;
  openingBalance: number;
  paymentTerm: {
    name: string;
    value: string;
    days: number;
  };
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
    deletedInvoices: number;
    deletedPayments: number;
    invoicePayments: number;
    invoicedAmount: number;
    invoices: number;
    payments: number;
    unusedCredits: number;
  };
  type: string;
  website: string;
}

export interface CustomerWithId extends Customer {
  customerId: string;
}
