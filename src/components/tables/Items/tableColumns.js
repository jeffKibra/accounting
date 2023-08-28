const tableColumns = [
  { Header: 'Registration', accessor: 'name' },
  // { Header: 'Unique Identifier', accessor: 'sku' },
  { Header: 'Make', accessor: 'carMake' },
  { Header: 'Model', accessor: 'carModel' },
  { Header: 'Type', accessor: 'type' },
  { Header: 'Color', accessor: 'color' },
  { Header: 'Rate', accessor: 'rate', isNumeric: true },
  // { Header: 'Type', accessor: 'type' },
  // { Header: 'Cost', accessor: 'costPrice', isNumeric: true },
  // { Header: 'Tax', accessor: 'tax' },
];

export default tableColumns;
