import React from 'react';

//
import { useTaxes, useAccounts } from 'hooks';

import SkeletonLoader from 'components/ui/SkeletonLoader';
import Empty from 'components/ui/Empty';
//
import JournalForm from 'components/forms/Journal/JournalForm';

function EditJournal(props) {
  const { isLoading: loadingTaxes, taxes } = useTaxes();
  const { accounts, loading: loadingAccounts } = useAccounts();

  const loading = loadingAccounts || loadingTaxes;

  return loading ? (
    <SkeletonLoader />
  ) : accounts?.length > 0 ? (
    <JournalForm {...props} accounts={accounts} taxes={taxes} />
  ) : (
    <Empty message="Accounts data not found! Try Reloading the page." />
  );
}

export default EditJournal;
