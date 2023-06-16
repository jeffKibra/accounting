import { Timestamp } from 'firebase/firestore';
//
import { IContactSummary, Item, PaymentMode } from '.';

export type IBookingDateRange = [string, string];

export interface IBookingAdjustmentData {
  itemId: string;
  booking: IBookingDateRange | null;
}

export type IItemBookings = string[]; //array of date strings
export type IMonthBookings = Record<string, IItemBookings | null>;
export type IMonthlyBookings = Record<string, IMonthBookings | null>;

export interface IGetMonthBookingSuccessPayload {
  bookings: IMonthBookings | null;
  monthId: string;
}

//eslint-disable-next-line
export interface IBookingItem
  extends Pick<
    Item,
    'name' | 'itemId' | 'salesAccount' | 'rate' | 'sku' | 'type' | 'unit'
  > {}
//eslint-disable-next-line

export interface IBookingDownPayment {
  paymentMode: PaymentMode;
  reference: string;
  amount: number;
}

export interface IBookingForm {
  customer: IContactSummary;
  item: IBookingItem;
  customerNotes: string;
  // dateRange: IBookingDateRange;
  startDate: Date | string;
  endDate: Date | string;
  quantity: number;
  saleDate: Date;
  dueDate: Date | Timestamp;
  bookingRate: number;
  bookingTotal: number;
  transferAmount: number;
  total: number;
  downPayment: IBookingDownPayment;
  // transactionType: keyof SaleTransactionTypes;
  // paymentTerm: PaymentTerm;
  // preTaxBookingRate: number;
  // preTaxBookingTotal: number;
  // itemTax: number;
  // itemTaxTotal: number;
  // saleTax?: Tax;
}

export interface IBookingPayments {
  [key: string]: number;
}

interface Meta {
  transactionType: 'booking';
  balance: number;
  isSent: boolean;
  isOverdue: boolean;
  overdueAt?: Timestamp;
  paymentsCount: number;
  paymentsIds: string[];
  paymentsReceived: IBookingPayments;
  status: number;
  orgId: string;
  createdAt: Date | Timestamp;
  createdBy: string;
  modifiedAt: Date | Timestamp;
  modifiedBy: string;
}

export interface IBookingFromDb extends IBookingForm, Meta {}

export interface IBooking extends IBookingFromDb {
  id: string;
}

export interface IMonthlyBookingUpdateData {
  datesToCreate: string[];
  datesToDelete: string[];
  unchangedDates: string[];
}

export interface IBookingSummary
  extends Pick<
    IBooking,
    | 'balance'
    | 'dueDate'
    | 'saleDate'
    | 'id'
    | 'status'
    | 'transactionType'
    | 'bookingTotal'
    | 'transferAmount'
    | 'total'
  > {}
