import { Timestamp } from 'firebase/firestore';
//

//
import {
  IContactSummary,
  IVehicle,
  PaymentMode,
  // ISearchQueryOptions
  IInvoice,
} from '.';

export interface IBookingAdjustmentData {
  itemId: string;
  booking: IBookingDateRange | null;
}

// export type IItemBookings = string[]; //array of date strings
// export type IMonthBookings = Record<string, IItemBookings | null>;
// export type IMonthlyBookings = Record<string, IMonthBookings | null>;

// export interface IGetMonthBookingSuccessPayload {
//   bookings: IMonthBookings | null;
//   monthId: string;
// }

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

////
//
//
//
//

export type IBookingDateRange = [string, string];

export interface IBookingAdjustmentData {
  itemId: string;
  booking: IBookingDateRange | null;
}

export type IMonthlyBookings = Record<string, Record<string, string>>;

//eslint-disable-next-line
export interface IBookingItem
  extends Pick<
    IVehicle,
    '_id' | 'registration' | 'rate' | 'color' | 'make' | 'model' | 'year'
  > {}

export interface IBookingDownPayment {
  paymentMode: PaymentMode;
  reference: string;
  amount: number;
}

export interface IBookingForm {
  customer: IContactSummary;
  vehicle: IBookingItem;
  customerNotes: string;
  startDate: Date | string;
  endDate: Date | string;
  selectedDates: string[];
  // dateRange: IBookingDateRange;
  saleDate: Date;
  bookingRate: number;
  bookingTotal: number;
  transferFee: number;
  subTotal: number;
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

interface ExtraFields {
  balance: number;
  payments: {
    count: number;
    paymentsIds: string[];
    amounts: IBookingPayments;
  };
}

interface Meta {
  transactionType: 'booking';
  isSent: boolean;
  isOverdue: boolean;
  overdueAt?: Timestamp;
  status: number;
  orgId: string;
  createdAt: Date | Timestamp;
  createdBy: string;
  modifiedAt: Date | Timestamp;
  modifiedBy: string;
}

export interface IBookingFromDb extends IBookingForm, ExtraFields {
  metaData: Meta;
}

export interface IBooking extends IBookingFromDb {
  _id: string;
}

export interface IMonthlyBookingUpdateData {
  datesToCreate: string[];
  datesToDelete: string[];
  unchangedDates: string[];
}

// export interface ISearchBookingsQueryOptions extends ISearchQueryOptions {}

export interface IMonthlyBookingUpdateData {
  datesToCreate: string[];
  datesToDelete: string[];
  unchangedDates: string[];
}

// export interface IBookingSummary
//   extends Pick<
//     IBooking,
//     | 'balance'
//     | 'dueDate'
//     | 'saleDate'
//     | 'id'
//     | 'status'
//     | 'transactionType'
//     | 'bookingTotal'
//     | 'transferAmount'
//     | 'total'
//   > {}


export type IBookingInvoice=Required<IInvoice>