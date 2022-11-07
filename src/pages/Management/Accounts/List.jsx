import { useEffect } from 'react';
import { connect } from 'react-redux';

import { Link, useLocation } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import { RiAddLine } from 'react-icons/ri';

import { FETCH_ACCOUNTS } from 'store/actions/accountsActions';

import PageLayout from '../../../components/layout/PageLayout';
//components
import SkeletonLoader from 'components/ui/SkeletonLoader';
import AlertError from 'components/ui/AlertError';

import AccountsTable from '../../../components/tables/Accounts/AccountsTable';

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
      actions={
        <Link to={`${location.pathname}/new`}>
          <Button leftIcon={<RiAddLine />} colorScheme="cyan" size="sm">
            New Account
          </Button>
        </Link>
      }
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
