import { Timestamp } from "firebase/firestore";

export interface TaxForm {
  name: string;
  rate: number;
}

interface Meta {
  createdAt: Timestamp | Date;
  createdBy: string;
  modifiedAt: Timestamp | Date;
  modifiedBy: string;
}

export interface TaxFromDb extends TaxForm, Meta {}

export interface Tax extends TaxFromDb {
  taxId: string;
}
