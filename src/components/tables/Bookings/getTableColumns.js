function getTableColumns(showCustomer, enableActions) {
  const tableColumns = [
    { Header: 'Car', accessor: 'vehicle.registration' },
    { Header: 'Booking Dates', accessor: 'dates' },

    { Header: 'Days', accessor: 'days', isNumeric: true },
    { Header: 'Booking#', accessor: 'id' },
    ...(showCustomer
      ? [{ Header: 'Customer', accessor: 'customer.displayName' }]
      : []),
    // { Header: 'Status', accessor: 'status' },
    // { Header: 'Payments Due', accessor: 'dueDate' },
    { Header: 'Total', accessor: 'total', isNumeric: true },
    { Header: 'Imprest', accessor: 'imprest', isNumeric: true },
    { Header: 'Balance', accessor: 'balance', isNumeric: true },
    { Header: 'Payment', accessor: 'paymentAmount', isNumeric: true },
    { Header: 'Pay', accessor: 'paymentInput', isNumeric: true },
    ...(enableActions
      ? [{ Header: '', accessor: 'actions', isNumeric: true }]
      : []),
  ];

  return tableColumns;
}

export default getTableColumns;
