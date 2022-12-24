import { Box, Flex, Button } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useForm, FormProvider } from 'react-hook-form';
import { connect } from 'react-redux';

import formats from 'utils/formats';
import { confirmFutureDate } from 'utils/dates';
import { useToasts, useGetSalesProps } from 'hooks';

import SkeletonLoader from 'components/ui/SkeletonLoader';
import Empty from 'components/ui/Empty';

import FormFields from './FormFields';
import LineEntries from './LineEntries';

function JournalForm(props) {
  const { journal, handleFormSubmit, updating, taxes, accounts } = props;

  const today = new Date();
  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: {
      notes: journal?.notes || '',
      reference: journal?.reference || '',
      journalDate: journal?.journalDate || today,
      entries: journal?.entries || [
        {
          account: null,
          description: '',
          contact: null,
          tax: null,
          debit: 0,
          credit: 0,
        },
      ],
      summary: journal?.summary || {
        subTotal: 0,
        taxes: [],
        totalAmount: 0,
      },
    },
  });
  const { handleSubmit } = formMethods;

  const toasts = useToasts();

  // console.log({
  //   dirtyFields,
  //   isDirty,
  //   totalAmount: journal?.summary?.totalAmount,
  // });

  function onSubmit(data) {
    const { customer: customerId, paymentTerm: paymentTermId, ...rest } = data;
    const { journalDate, dueDate, entries } = rest;
    let formValues = { ...rest };
    /**
     * check if selected items is not an empty array or
     * values are not empty objects-item set to null
     */

    const fieldsValid =
      (entries && entries.filter(item => item).length > 0) || false;
    // console.log({ entries });

    if (!fieldsValid) {
      return toasts.error('Please add atleast one(1) item to proceed!');
    }
    // if (totalAmount <= 0) {
    //   return toasts.error("Total Sale Amount should be greater than ZERO(0)!");
    // }

    /**
     * ensure dueDate is not a past date
     */
    const dueDateIsFuture = confirmFutureDate(journalDate, dueDate);
    if (!dueDateIsFuture) {
      return toasts.error('Due date cannot be less than journal date');
    }

    // const customer = customers.find(
    //   customer => customer.customerId === customerId
    // );
    // if (!customer) {
    //   return toasts.error('Selected an Invalid customer');
    // }
    // formValues.customer = formats.formatCustomerData(customer);

    // const paymentTerm = paymentTerms.find(term => term.value === paymentTermId);
    // if (!paymentTerm) {
    //   return toasts.error('Selected Payment Term is not a valid Payment Term');
    // }
    // formValues.paymentTerm = paymentTerm;

    // if (journal) {
    //   //journal is being updated-submit only the changed values
    //   formValues = getDirtyFields(dirtyFields, formValues);
    // }
    // console.log({ formValues });

    //submit the data
    handleFormSubmit(formValues);
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

          {/* <Grid
            w="full"
            rowGap={2}
            columnGap={4}
            templateColumns="repeat(12, 1fr)"
          >
            <GridItem colSpan={[0, 4, 6]}></GridItem>
            <GridItem colSpan={[12, 8, 6]}>
              <SaleSummaryTable loading={loading} summary={summary} />
            </GridItem>
          </Grid> */}
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

function mapStateToProps(state) {
  const { accounts } = state?.accountsReducer;

  return { accounts };
}

export default connect(mapStateToProps)(JournalForm);
