import { useMemo } from 'react';
import PropTypes from 'prop-types';

import AccountOptions from '../../../containers/Management/Accounts/AccountsOptions';

import CustomTable from '../CustomTable';

function AccountsTable(props) {
  const { accounts } = props;
  // console.log({ accounts });

  const columns = useMemo(() => {
    return [
      { Header: 'Account Name', accessor: 'name' },
      { Header: 'Account Type', accessor: 'accountType.name' },
      { Header: 'Balance', accessor: 'balance', isNumeric: true },
      { Header: '', accessor: 'actions', isNumeric: true, width: '1%' },
    ];
  }, []);

  const data = useMemo(() => {
    return accounts.map(account => {
      // const {
      //   summary: { invoicedAmount, invoicePayments },
      // } = account;
      // const receivables = +invoicedAmount - +invoicePayments;

      return {
        ...account,
        receivables: 0,
        actions: <AccountOptions account={account} edit view deletion />,
      };
    });
  }, [accounts]);

  return <CustomTable data={data} columns={columns} />;
}

AccountsTable.propTypes = {
  accounts: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      accountType: PropTypes.shape({
        id: PropTypes.string.isRequired,
        main: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      }).isRequired,
      accountId: PropTypes.string.isRequired,
      openingBalance: PropTypes.number,
    })
  ),
};

export default AccountsTable;
