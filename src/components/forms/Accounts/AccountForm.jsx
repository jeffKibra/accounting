import PropTypes from 'prop-types';
import { useEffect } from 'react';

import { Button, Box, Spinner } from '@chakra-ui/react';

import { useForm, FormProvider } from 'react-hook-form';

import { useAccountTypes } from 'hooks';

import FormFields from './FormFields';
import AlertError from 'components/ui/AlertError';

//-------------------------------------------------------------------
AccountForm.propTypes = {
  loading: PropTypes.bool.isRequired,
  defaultValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
};

export default function AccountForm({ loading, defaultValues, onSubmit }) {
  const { accountTypes, errorMsg, fetchAccountTypes } = useAccountTypes({
    defaultFetch: false,
  });

  useEffect(() => {
    if (!accountTypes) {
      fetchAccountTypes();
    }
  }, [fetchAccountTypes, accountTypes]);

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: {
      name: defaultValues?.name || '',
      accountType: defaultValues?.accountType || null,
      description: defaultValues?.description || '',
    },
  });

  const { handleSubmit } = formMethods;

  return (
    <FormProvider {...formMethods}>
      <Box as="form" role="form" onSubmit={handleSubmit(onSubmit)}>
        {Array.isArray(accountTypes) ? (
          <FormFields accountTypes={accountTypes} loading={loading} />
        ) : errorMsg ? (
          <AlertError title="Error fetching Account Types" message={errorMsg} />
        ) : (
          <Box w="full" display="flex" justifyContent="center" h="full" py={6}>
            <Spinner />
          </Box>
        )}

        <Box display="flex" justifyContent="flex-end">
          <Button disabled={loading} colorScheme="red" onClick={() => {}}>
            cancel
          </Button>

          <Button ml={4} colorScheme="cyan" type="submit" isLoading={loading}>
            save
          </Button>
        </Box>
      </Box>
    </FormProvider>
  );
}
