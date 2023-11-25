import { IAddress } from './address';
import { PaymentMode } from './paymentMode';
import { PaymentTerm } from './paymentTerm';
import { ITax } from './tax';

interface Meta {
  createdAt: Date | string;
  createdBy: string;
  modifiedBy: string;
  modifiedAt: Date | string;
  status: 0 | -1;
}

export interface IOrgForm {
  name: string;
  businessType: {
    name: string;
    value: string;
  };
  industry: string;
  phone: string;
  address: IAddress;
  website: string;
}

export interface IOrg extends IOrgForm {
  _id: string;
  taxes: ITax[];
  paymentModes: PaymentMode[];
  paymentTerms: PaymentTerm[];
  metaData: Meta;
}

export interface IOrgSummary extends Pick<IOrg, 'name' | 'businessType'> {
  orgId?: string;
}
