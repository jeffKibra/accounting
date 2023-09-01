export interface ICarModelForm {
  [x: string]: unknown;
  make: string;
  model: string;
  type: string;
  years: number[];
}

export interface ICarModel extends ICarModelForm {
  id: string;
}

export type ICarModels = Record<string, Record<string, ICarModel>>;
