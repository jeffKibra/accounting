import { Box, Flex, Button } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useForm, FormProvider } from 'react-hook-form';

// import formats from 'utils/formats';
import { useToasts } from 'hooks';

import FormFields from './FormFields';
import LineEntries from './LineEntries';
import Summary from './Summary';

export const initialJournalEntry = {
  account: null,
  description: '',
  contact: null,
  tax: null,
  type: 'credit',
  amount: 0,
};

export default function JournalForm(props) {
  const { journal, handleFormSubmit, updating, taxes, accounts } = props;

  const today = new Date();
  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: {
      notes: journal?.notes || '',
      reference: journal?.reference || '',
      journalDate: journal?.journalDate || today,
      entries: journal?.entries || [
        initialJournalEntry,
        { ...initialJournalEntry, type: 'debit' },
      ],
      summary: journal?.summary || {
        subTotal: 0,
        taxes: [],
        totalAmount: 0,
      },
    },
  });
  const { handleSubmit, setError } = formMethods;

  const toasts = useToasts();

  // console.log({
  //   dirtyFields,
  //   isDirty,
  //   totalAmount: journal?.summary?.totalAmount,
  // });

  function onSubmit(data) {
    console.log({ data });
    const difference = data?.summary?.difference || 0;
    // console.log({ difference });

    if (difference) {
      return setError('summary', {
        type: 'validate',
        message: 'The Debits and the Credits must be equal!',
      });
    }

    const { entries } = data;
    /**
     * check if selected items is not an empty array or
     * values are not empty objects-item set to null
     */

    const fieldsValid =
      (entries && entries.filter(item => item).length > 0) || false;
    // console.log({ entries });

    if (!fieldsValid) {
      return toasts.error('Please add atleast one(1) entry to proceed!');
    }
    //submit the data
    handleFormSubmit(data);
  }

  // console.log({ customers, items, paymentTerms, loading });

  return (
    <FormProvider {...formMethods}>
      <Box as="form" role="form" onSubmit={handleSubmit(onSubmit)} w="full">
        <Box
          // h="full"
          mt={2}
          p={4}
          pb={6}
          bg="white"
          borderRadius="lg"
          shadow="lg"
          border="1px solid"
          borderColor="gray.200"
          // maxW="container.sm"
        >
          <FormFields />

          <LineEntries
            accounts={accounts || []}
            loading={false}
            taxes={taxes || []}
            customers={[]}
          />

          <Summary />
        </Box>
        <Flex w="full" py={6} justify="flex-end">
          <Button
            size="lg"
            type="submit"
            isLoading={updating}
            colorScheme="cyan"
          >
            save
          </Button>
        </Flex>
      </Box>
    </FormProvider>
  );
}

JournalForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  updating: PropTypes.bool.isRequired,
  taxes: PropTypes.array,
  accounts: PropTypes.array.isRequired,
  journal: PropTypes.shape({
    summary: PropTypes.shape({
      shipping: PropTypes.number,
      adjustment: PropTypes.number,
      totalTax: PropTypes.number,
      totalAmount: PropTypes.number,
      subTotal: PropTypes.number,
      taxes: PropTypes.array,
    }),
    lineEntries: PropTypes.array,
    customerId: PropTypes.string,
    journalDate: PropTypes.instanceOf(Date),
    dueDate: PropTypes.instanceOf(Date),
    subject: PropTypes.string,
    customerNotes: PropTypes.string,
    journalId: PropTypes.string,
  }),
};
