function getTableColumns(showCustomer, enableActions) {
  const tableColumns = [
    { Header: 'Booking#', accessor: '_id' },
    { Header: 'Car', accessor: 'vehicle.registration' },
    { Header: 'Booking Dates', accessor: 'dates' },
    // { Header: 'Date Out', accessor: 'startDate' },
    // { Header: 'Date In', accessor: 'endDate' },

    // { Header: 'Days', accessor: 'days', isNumeric: true },
    ...(showCustomer
      ? [{ Header: 'Customer', accessor: 'customer.displayName' }]
      : []),
    // { Header: 'Status', accessor: 'status' },
    // { Header: 'Payments Due', accessor: 'dueDate' },
    { Header: 'Total', accessor: 'total', isNumeric: true },
    // { Header: 'Imprest', accessor: 'imprest', isNumeric: true },
    { Header: 'Balance', accessor: 'balance', isNumeric: true },
    { Header: 'Payment', accessor: 'allocatedAmount', isNumeric: true },
    { Header: 'Pay', accessor: 'paymentAllocationInput', isNumeric: true },
    ...(enableActions
      ? [{ Header: '', accessor: 'actions', isNumeric: true }]
      : []),
  ];

  return tableColumns;
}

export default getTableColumns;
