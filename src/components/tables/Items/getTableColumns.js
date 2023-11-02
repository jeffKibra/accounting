function getTableColumns(enableActions) {
  // console.log({ enableActions });
  const tableColumns = [
    { Header: 'Registration', accessor: 'registration' },
    // { Header: 'Unique Identifier', accessor: 'sku' },
    { Header: 'Make', accessor: 'make' },
    { Header: 'Model', accessor: 'carModel' },
    { Header: 'Type', accessor: 'type' },
    { Header: 'Color', accessor: 'color' },
    { Header: 'Rate', accessor: 'rate', isNumeric: true },
    ...(enableActions
      ? [{ Header: '', accessor: 'actions', isNumeric: true, width: '1%' }]
      : []),
    // { Header: 'Type', accessor: 'type' },
    // { Header: 'Cost', accessor: 'costPrice', isNumeric: true },
    // { Header: 'Tax', accessor: 'tax' },
  ];

  return tableColumns;
}

export default getTableColumns;