type TypeDetails = {
  main: string;
  name: string;
};

type TypesOfAccounts = {
  [key: string]: TypeDetails;
  // other_asset: TypeDetails;
  // other_current_asset: TypeDetails;
  // cash: TypeDetails;
  // bank: TypeDetails;
  // fixed_asset: TypeDetails;
  // stock: TypeDetails;
  // accounts_receivable: TypeDetails;
  // payment_clearing: TypeDetails;
  // input_tax: TypeDetails;
  // other_current_liability: TypeDetails;
  // credit_card: TypeDetails;
  // accounts_payable: TypeDetails;
  // long_term_liability: TypeDetails;
  // other_liability: TypeDetails;
  // overseas_tax_payable: TypeDetails;
  // output_tax: TypeDetails;
  // equity: TypeDetails;
  // income: TypeDetails;
  // other_income: TypeDetails;
  // expense: TypeDetails;
  // cost_of_goods_sold: TypeDetails;
  // other_expense: TypeDetails;
};

const accountTypes: TypesOfAccounts = {
  other_asset: {
    main: "assets",
    name: "Other Asset",
  },
  other_current_asset: {
    main: "assets",
    name: "Other Current Asset",
  },
  cash: {
    main: "assets",
    name: "Cash",
  },
  bank: {
    main: "assets",
    name: "Bank",
  },
  fixed_asset: {
    main: "assets",
    name: "Fixed Asset",
  },
  stock: {
    main: "assets",
    name: "Stock",
  },
  accounts_receivable: {
    main: "assets",
    name: "Accounts Receivable",
  },
  payment_clearing: {
    main: "assets",
    name: "Payment Clearing",
  },
  input_tax: {
    main: "assets",
    name: "Input Tax",
  },
  other_current_liability: {
    main: "liability",
    name: "Other Current Liability",
  },
  credit_card: {
    main: "liability",
    name: "Credit Card",
  },
  accounts_payable: {
    main: "liability",
    name: "Accounts Payable",
  },
  long_term_liability: {
    main: "liability",
    name: "Long Term Liability",
  },
  other_liability: {
    main: "liability",
    name: "Other Liability",
  },
  overseas_tax_payable: {
    main: "liability",
    name: "Overseas Tax Payable",
  },
  output_tax: {
    main: "liability",
    name: "Output Tax",
  },
  equity: {
    main: "equity",
    name: "Equity",
  },
  income: {
    main: "income",
    name: "Income",
  },
  other_income: {
    main: "income",
    name: "Other Income",
  },
  expense: {
    main: "expense",
    name: "Expense",
  },
  cost_of_goods_sold: {
    main: "expense",
    name: "Cost of Goods Sold",
  },
  other_expense: {
    main: "expense",
    name: "Other Expense",
  },
};

export default accountTypes;
