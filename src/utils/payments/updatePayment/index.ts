import { InvoicePaymentMapping, PaymentReceived, Entry } from "types";

interface PaymentEntry extends InvoicePaymentMapping {
  entry: Entry | null;
}

export interface UpdateData {
  paymentAccountEntriesToUpdate: PaymentEntry[];
  paymentAccountEntriesToDelete: PaymentEntry[];
  accountsReceivableEntriesToUpdate: PaymentEntry[];
  accountsReceivableEntriesToDelete: PaymentEntry[];
  overPayEntry: Entry | null;
  paymentsToCreate: InvoicePaymentMapping[];
  paymentsToUpdate: InvoicePaymentMapping[];
  paymentsToDelete: InvoicePaymentMapping[];
  currentPayment: PaymentReceived;
  paymentsTotal: number;
}

export { default as updatePayment } from "./updatePayment";
export { default as fetchPaymentUpdateData } from "./fetchPaymentUpdateData";
