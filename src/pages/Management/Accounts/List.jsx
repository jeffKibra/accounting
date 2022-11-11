import { useEffect } from 'react';
import { connect } from 'react-redux';

import { useLocation } from 'react-router-dom';

import { FETCH_ACCOUNTS } from 'store/actions/accountsActions';

import PageLayout from '../../../components/layout/PageLayout';
//components
import SkeletonLoader from 'components/ui/SkeletonLoader';
import AlertError from 'components/ui/AlertError';

import AccountsTable from '../../../components/tables/Accounts/AccountsTable';

import CreateAccount from './CreateAccount';

function AccountsListPage(props) {
  console.log({ props });
  const { fetchList, accounts, error } = props;

  const location = useLocation();

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return (
    <PageLayout
      pageTitle="Chart of Accounts"
      actions={<CreateAccount />}
      breadcrumbLinks={{
        Dashboard: '/',
        Accounts: location.pathname,
      }}
    >
      {accounts ? (
        <AccountsTable accounts={accounts} />
      ) : error ? (
        <AlertError
          title="Error fetching list of accounts: "
          message={error?.message}
        />
      ) : (
        <SkeletonLoader />
      )}
    </PageLayout>
  );
}

function mapStateToProps(state) {
  const { chartOfAccounts: accounts, error } = state.accountsReducer;

  return {
    accounts,
    error,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchList: () => dispatch({ type: FETCH_ACCOUNTS }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountsListPage);
