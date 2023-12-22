function getTableColumns(showCustomer, enableActions = true) {
  const tableColumns = [
    { Header: 'Date', accessor: 'paymentDate' },
    // { Header: 'Payment#', accessor: '_id' },
    ...(showCustomer
      ? [{ Header: 'Customer', accessor: 'customer.displayName' }]
      : []),
    //   { Header: "Invoices", accessor: "invoices" },
    { Header: 'Mode', accessor: 'paymentMode.name' },
    { Header: 'Amount', accessor: 'amount', isNumeric: true },
    { Header: 'Reference', accessor: 'reference' },
    { Header: 'Excess', accessor: 'excess', isNumeric: true },
    ...(enableActions ? [{ Header: '', accessor: 'actions' }] : []),
  ];

  return tableColumns;
}

export default getTableColumns;
