import { ITaxSummary } from '.';
import { IAccountSummary } from '.';

export interface ExpenseItem {
  amount: number;
  details: string;
  itemRate: number;
  itemTax: number;
  tax: ITaxSummary;
  account: IAccountSummary;
}
