import { useSelector } from 'react-redux';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  Box,
  Flex,
  Grid,
  GridItem,
  Textarea,
} from '@chakra-ui/react';
import { RiAddLine } from 'react-icons/ri';
import { useForm, FormProvider } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';

import NumInput from '../../ui/NumInput';
import CustomSelect from '../../ui/CustomSelect';

const schema = yup.object().shape({
  accountId: yup.string().required('*Required!'),
  details: yup.string().required('*Required!'),
  taxId: yup.string(),
  amount: yup
    .number()
    .typeError('Value must be a number')
    .positive('value must be a positive number!')
    .min(1, 'Value should be greater than zero(0)!')
    .required('*Required'),
});

function ExpenseItemDetailsForm(props) {
  const { handleFormSubmit, expense, onClose } = props;
  const accounts = useSelector(state => state.accountsReducer?.accounts) || [];
  const taxes = useSelector(state => state.taxesReducer?.taxes) || [];

  const formMethods = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      accountId: expense?.account?.accountId || '',
      details: expense?.details || '',
      taxId: expense?.tax?.taxId || '',
      amount: expense?.amount || 0,
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = formMethods;

  const expenseAccounts = accounts.filter(account => {
    const {
      tags,
      accountType: { main },
    } = account;
    const index = tags.findIndex(tag => tag === 'payable');

    return main === 'expense' || index > -1;
  });

  function onSubmit(data) {
    // console.log({ data });
    const { accountId, taxId } = data;
    //add tax
    const tax = taxes.find(tax => tax.taxId === taxId) || {};
    //account
    const account = expenseAccounts.find(
      account => account.accountId === accountId
    );

    const newData = {
      ...data,
      tax,
      account,
    };

    handleFormSubmit(newData);
    reset();
    onClose();
  }

  return (
    <FormProvider {...formMethods}>
      <Box as="form" role="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid rowGap={2} columnGap={2} templateColumns="repeat(12, 1fr)">
          <GridItem colSpan={12}>
            <FormControl isRequired isInvalid={errors.accountId}>
              <FormLabel htmlFor="accountId">Expense Account</FormLabel>
              <CustomSelect
                name="accountId"
                placeholder="---Expense Account---"
                groupedOptions={expenseAccounts.map(account => {
                  const { name, accountId, accountType } = account;
                  return {
                    name,
                    value: accountId,
                    groupName: accountType.name,
                  };
                })}
              />
              <FormErrorMessage>{errors.accountId?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem colSpan={12}>
            <FormControl isRequired isInvalid={errors.details}>
              <FormLabel htmlFor="details">What did you pay For?</FormLabel>
              <Textarea {...register('details')} resize="none" />
              <FormErrorMessage>{errors.details?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem colSpan={6}>
            <FormControl isInvalid={errors.taxId}>
              <FormLabel htmlFor="taxId">Tax</FormLabel>
              <CustomSelect
                name="taxId"
                placeholder="select tax"
                options={taxes.map(tax => {
                  const { taxId, name, rate } = tax;
                  return { value: taxId, name: `${name} (${rate}%)` };
                })}
              />
              <FormErrorMessage>{errors.taxId?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem colSpan={6}>
            <FormControl isRequired isInvalid={errors.amount}>
              <FormLabel htmlFor="amount">Amount</FormLabel>
              <NumInput name="amount" min={0} />
              <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
        </Grid>

        <Flex my={4} w="full" justify="flex-end">
          {onClose && (
            <Button mr={2} onClick={onClose}>
              CLOSE
            </Button>
          )}
          <Button type="submit" rightIcon={<RiAddLine />} colorScheme="cyan">
            ADD
          </Button>
        </Flex>
      </Box>
    </FormProvider>
  );
}

ExpenseItemDetailsForm.propTypes = {
  taxes: PropTypes.array,
  handleFormSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  expense: PropTypes.shape({
    accountId: PropTypes.string,
    details: PropTypes.string,
    taxId: PropTypes.string,
    amount: PropTypes.number,
  }),
};

export default ExpenseItemDetailsForm;
