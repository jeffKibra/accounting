function getTableColumns() {
  const tableColumns = [
    { Header: 'Name', accessor: 'displayName' },
    { Header: 'Company Name', accessor: 'companyName' },
    { Header: 'Email', accessor: 'email' },
    { Header: 'Phone', accessor: 'phone' },
    {
      Header: 'Pending',
      accessor: 'receivables',
      isNumeric: true,
    },
    {
      Header: 'Unused Credits',
      accessor: 'summary.unusedCredits',
      isNumeric: true,
    },
    { Header: '', accessor: 'actions', isNumeric: true, width: '1%' },
  ];

  return tableColumns;
}

export default getTableColumns;
