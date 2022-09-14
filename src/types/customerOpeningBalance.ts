import { Timestamp } from 'firebase/firestore';
import {
  CustomerOpeningBalanceTransactionType,
  InvoicePayments,
  OrgSummary,
  CustomerSummary,
} from '.';

interface Meta {
  transactionType: keyof CustomerOpeningBalanceTransactionType;
  balance: number;
  isSent: boolean;
  paymentsCount: number;
  paymentsIds: string[];
  paymentsReceived: InvoicePayments;
  status: number;
  org: OrgSummary;
  createdAt: Date | Timestamp;
  createdBy: string;
  modifiedAt: Date | Timestamp;
  modifiedBy: string;
}

export interface CustomerOpeningBalanceForm {
  customer: CustomerSummary;
  amount: number;
}

export interface CustomerOpeningBalanceFromDb
  extends CustomerOpeningBalanceForm,
    Meta {}

export interface CustomerOpeningBalance extends CustomerOpeningBalanceFromDb {
  openingBalanceId: string;
}
