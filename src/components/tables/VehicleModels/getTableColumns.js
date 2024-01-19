function getTableColumns() {
  const tableColumns = [
    { Header: 'Make', accessor: 'make' },
    { Header: 'Model', accessor: 'name' },
    { Header: 'Type', accessor: 'type' },
    // { Header: 'Years', accessor: 'years' },
    { Header: 'Is Owner', accessor: 'isOwner' },
    { Header: '', accessor: 'actions', isNumeric: true, width: '1%' },
  ];

  return tableColumns;
}

export default getTableColumns;
