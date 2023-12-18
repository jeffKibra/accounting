// import { IPaginationParams } from './pagination';
// import { ISearchQueryOptions } from './search';

// export type IVehicleType = 'Ivehicle' | 'opening_balance';

export interface IVehicleModel {
  model: string;
  make: string;
  type: string;
  __typename?: string;
}

export interface IVehicleFormData {
  registration: string;
  rate: number;
  // sku: string;
  make: string;
  color: string;
  model: IVehicleModel;
  year: number;
  description: string;
  // salesAccount: Account;
  // type: IVehicleType;
  // saleTax?: Tax;
  // saleTaxType?: string;
}

export interface IVehicleSummary extends IVehicleFormData {
  _id: string;
}
interface Meta {
  availableDates: Record<string, Record<string, string[]>>;
  createdAt: Date;
  createdBy: string;
  modifiedAt: Date;
  modifiedBy: string;
  unit: 'days';
  orgId: string;
  status: string;
}

export interface IVehicle extends IVehicleFormData {
  _id: string;
  metaData: Meta;
  __typename?: string;
}

export interface IVehicleForBooking
  extends Pick<
    IVehicle,
    | '_id'
    | 'registration'
    | 'rate'
    | 'color'
    | 'make'
    | 'model'
    | 'year'
    | '__typename'
  > {}

export interface IPaginationLastDoc {
  _id: string;
  searchScore: number;
}
export interface ISearchVehiclesPagination {
  currentPage: number;
  lastDoc: IPaginationLastDoc;
  limit: number;
}

// export interface ISearchVehiclesQueryOptions extends ISearchQueryOptions {
//   bookingId?: string;
//   selectedDates?: string[];
// }
