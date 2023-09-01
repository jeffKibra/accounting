import { useMemo } from 'react';
import PropTypes from 'prop-types';

import VendorOptions from '../../../containers/Management/Vendors/VendorOptions';

import CustomTable from '../CustomTable';

function VendorsTable(props) {
  const { vendors } = props;
  // console.log({ vendors });

  const columns = useMemo(() => {
    return [
      { Header: '', accessor: 'actions' },
      { Header: 'Name', accessor: 'displayName' },
      { Header: 'Company Name', accessor: 'companyName' },
      { Header: 'Email', accessor: 'email' },
      { Header: 'Phone', accessor: 'phone' },
      {
        Header: 'Payables',
        accessor: 'payables',
        isNumeric: true,
      },
      {
        Header: 'Unused Credits',
        accessor: 'summary.unusedCredits',
        isNumeric: true,
      },
    ];
  }, []);

  const data = useMemo(() => {
    return vendors.map(vendor => {
      return {
        ...vendor,
        payables: 0,
        actions: <VendorOptions vendor={vendor} edit deletion />,
      };
    });
  }, [vendors]);

  return <CustomTable data={data} columns={columns} />;
}

VendorsTable.propTypes = {
  vendors: PropTypes.arrayOf(
    PropTypes.shape({
      displayName: PropTypes.string.isRequired,
      companyName: PropTypes.string,
      id: PropTypes.string.isRequired,
      phone: PropTypes.string,
      email: PropTypes.string,
      openingBalance: PropTypes.number,
    })
  ),
};

export default VendorsTable;
