// import { OneOfType } from ".";

export interface InvoiceTransactionTypes {
  invoice: {
    name: "Invoice";
    value: "invoice";
  };
  customer_opening_balance: {
    name: "Customer Opening Balance";
    value: "customer_opening_balance";
  };
}

export interface TransactionTypes extends InvoiceTransactionTypes {
  invoice_payment: {
    name: "Invoice Payment";
    value: "invoice_payment";
  };
  opening_balance: {
    name: "Opening Balance";
    value: "opening_balance";
  };
  customer_payment: {
    name: "Customer Payment";
    value: "customer_payment";
  };
  sales_receipt: {
    name: "Sales Receipt";
    value: "sales_receipt";
  };
  expense: {
    name: "Expense";
    value: "expense";
  };
}
