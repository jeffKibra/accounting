import { IContactSummary, Item } from '.';

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

export interface IBookingSaleForm {
  customer: IContactSummary;
  item: IBookingItem;
  customerNotes: string;
  dateRange: IBookingDateRange;
  quantity: number;
  saleDate: Date;
  bookingRate: number;
  bookingTotal: number;
  transferAmount: number;
  total: number;
  // transactionType: keyof SaleTransactionTypes;
  // paymentTerm: PaymentTerm;
  // preTaxBookingRate: number;
  // preTaxBookingTotal: number;
  // itemTax: number;
  // itemTaxTotal: number;
  // saleTax?: Tax;
}

export interface IMonthlyBookingUpdateData {
  datesToCreate: string[];
  datesToDelete: string[];
  unchangedDates: string[];
}
