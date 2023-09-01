import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

//hooks
import { useChartOfAccounts } from 'hooks';
//contexts
import { EditAccountContextProvider } from 'contexts/EditAccountContext';

import PageLayout from 'components/layout/PageLayout';
//components
import SkeletonLoader from 'components/ui/SkeletonLoader';
import AlertError from 'components/ui/AlertError';

import AccountsTable from 'components/tables/Accounts/AccountsTable';

import CreateAccount from 'containers/Management/Accounts/CreateAccount';

export default function AccountsListPage() {
  // console.log({ props });
  const { fetchChartOfAccountsList, accounts, error } = useChartOfAccounts();

  const location = useLocation();

  useEffect(() => {
    fetchChartOfAccountsList();
  }, [fetchChartOfAccountsList]);

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
        <EditAccountContextProvider>
          <AccountsTable accounts={accounts} />
        </EditAccountContextProvider>
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
