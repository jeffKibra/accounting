import { Account, Tax } from '.';

export type ItemType = 'goods' | 'service' | 'vehicle';
export interface VehicleFormData {
  name: string;
  salesAccount: Account;
  sellingPrice: number;
  sku: string;
  skuOption: string;
  type: ItemType;
  unit: string;
  costPrice?: number;
  extraDetails?: string;
  salesTax?: Tax;
  pricesIncludeTax?: string;
  variant?: string;
}

interface Meta {
  status: string;
  createdAt: Date;
  createdBy: string;
  modifiedAt: Date;
  modifiedBy: string;
}

export interface VehicleFromDb extends VehicleFormData, Meta {}

export interface Vehicle extends VehicleFromDb {
  vehicleId: string;
}
