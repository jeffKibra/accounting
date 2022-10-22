interface Accounts {
  [key: string]: number;
}

interface PaymentModes {
  [key: string]: number;
}

export interface DailySummary {
  accounts: Accounts;
  customers: number;
  deletedInvoices: number;
  deletedPayments: number;
  expenses: number;
  invoices: number;
  invoicesTotal: number;
  items: number;
  payments: number;
  paymentsTotal: number;
  salesReceipts: number;
  vendors: number;
  paymentModes: PaymentModes;
}
