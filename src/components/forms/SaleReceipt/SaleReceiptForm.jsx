import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  FormHelperText,
  FormErrorMessage,
  Button,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { useForm, FormProvider } from 'react-hook-form';

//ui

import CustomSelect from '../../ui/CustomSelect';
import CustomDatePicker from '../../ui/CustomDatePicker';

import NormalSale from '../Sales/Normal';

//
import { SaleReceiptFormPropTypes } from 'propTypes';
// import SaleItemsForm from "../../../components/forms/Sales/SaleItemsForm";

export default function SaleReceiptForm(props) {
  const {
    salesReceipt,
    handleFormSubmit,
    updating,
    paymentModes,
    accounts,
    customers,
    items,
    taxes,
  } = props;
  // console.log({ props });

  const today = new Date();

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: {
      customerId: salesReceipt?.customer?.id || '',
      receiptDate: salesReceipt?.receiptDate || today,
      accountId: salesReceipt?.account?.accountId || 'undeposited_funds',
      paymentModeId: salesReceipt?.paymentMode?.value || 'cash',
      reference: salesReceipt?.reference || '',
      customerNotes: salesReceipt?.customerNotes || '',
      selectedItems: salesReceipt?.selectedItems || [
        {
          item: null,
          rate: 0,
          quantity: 0,
          itemRate: 0,
          itemTax: 0,
          itemRateTotal: 0,
          itemTaxTotal: 0,
          salesTax: null,
        },
      ],
      summary: salesReceipt?.summary || {
        adjustment: 0,
        shipping: 0,
        subTotal: 0,
        taxes: [],
        totalAmount: 0,
        totalTax: 0,
        taxType: 'taxExclusive',
      },
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = formMethods;

  function onSubmit(data) {
    let { customerId, paymentModeId, accountId, ...rest } = data;
    let customer = null;
    if (customerId) {
      customer = customers.find(customer => customer.id === customerId);
    }

    const paymentMode = paymentModes.find(mode => mode.value === paymentModeId);
    const account = accounts.find(account => account.accountId === accountId);
    const { name, accountType } = account;
    const newData = {
      ...rest,
      customer,
      paymentMode,
      account: { name, accountId, accountType },
    };
    console.log({ newData });

    handleFormSubmit(newData);
  }

  return (
    <Box w="full" h="full">
      <FormProvider {...formMethods}>
        <Box w="full" as="form" role="form" onSubmit={handleSubmit(onSubmit)}>
          <Box
            borderWidth="1px"
            borderColor="gray.300"
            mt={2}
            bg="white"
            borderRadius="lg"
            shadow="lg"
          >
            <Grid
              borderTopLeftRadius="lg"
              borderTopRightRadius="lg"
              p={4}
              bg="#f4f6f8"
              rowGap={2}
              columnGap={4}
              templateColumns="repeat(12, 1fr)"
            >
              <GridItem colSpan={[12, 4]}>
                <FormControl
                  isDisabled={updating}
                  isRequired
                  isInvalid={errors.receiptDate}
                >
                  <FormLabel htmlFor="receiptDate">Receipt Date</FormLabel>
                  <CustomDatePicker name="receiptDate" required />
                  <FormErrorMessage>
                    {errors.receiptDate?.message}
                  </FormErrorMessage>
                </FormControl>
              </GridItem>

              <GridItem colSpan={[12, 4]}>
                <FormControl
                  isDisabled={updating}
                  isInvalid={errors.customerId}
                >
                  <FormLabel htmlFor="customerId">Customer</FormLabel>
                  <CustomSelect
                    name="customerId"
                    placeholder="--select customer--"
                    isDisabled={updating}
                    options={customers.map(customer => {
                      const { id: customerId, displayName } = customer;

                      return { name: displayName, value: customerId };
                    })}
                  />
                  <FormErrorMessage>
                    {errors.customer?.message}
                  </FormErrorMessage>
                  <FormHelperText>
                    Leave blank for a walk-in customer
                  </FormHelperText>
                </FormControl>
              </GridItem>
              <GridItem colSpan={[12, 4]}>
                <FormControl
                  isDisabled={updating}
                  isInvalid={errors.customerNotes}
                >
                  <FormLabel htmlFor="customerNotes">Customer Notes</FormLabel>
                  <Textarea id="customerNotes" {...register('customerNotes')} />
                  <FormErrorMessage>
                    {errors.customerNotes?.message}
                  </FormErrorMessage>
                  <FormHelperText>
                    Include a note for the customer.
                  </FormHelperText>
                </FormControl>
              </GridItem>
            </Grid>
            <Box w="full" p={4}>
              <NormalSale loading={updating} items={items} taxes={taxes} />
            </Box>

            <Grid
              borderBottomLeftRadius="lg"
              borderBottomRightRadius="lg"
              p={4}
              pb={6}
              bg="#f4f6f8"
              rowGap={2}
              columnGap={4}
              templateColumns="repeat(12, 1fr)"
            >
              <GridItem colSpan={[12, 4]}>
                <FormControl
                  isDisabled={updating}
                  required
                  isInvalid={errors.accountId}
                >
                  <FormLabel htmlFor="accountId">Deposit To</FormLabel>
                  <CustomSelect
                    name="accountId"
                    placeholder="---select account---"
                    isDisabled={updating}
                    rules={{
                      required: { value: true, message: '*Required!' },
                    }}
                    groupedOptions={accounts.map(account => {
                      const { name, accountId, accountType } = account;
                      return {
                        name,
                        value: accountId,
                        groupName: accountType.name,
                      };
                    })}
                  />
                  <FormErrorMessage>
                    {errors.accountId?.message}
                  </FormErrorMessage>
                </FormControl>
              </GridItem>

              <GridItem colSpan={[12, 4]}>
                <FormControl
                  isDisabled={updating}
                  required
                  isInvalid={errors.paymentModeId}
                >
                  <FormLabel htmlFor="paymentModeId">Payment Mode</FormLabel>
                  <CustomSelect
                    name="paymentModeId"
                    options={paymentModes}
                    isDisabled={updating}
                    placeholder="select payment mode"
                    rules={{
                      required: { value: true, message: '*Required!' },
                    }}
                  />
                  <FormErrorMessage>
                    {errors.paymentModeId?.message}
                  </FormErrorMessage>
                </FormControl>
              </GridItem>

              <GridItem colSpan={[12, 4]}>
                <FormControl isDisabled={updating} isInvalid={errors.reference}>
                  <FormLabel htmlFor="reference">Reference#</FormLabel>
                  <Input id="reference" {...register('reference')} />
                  <FormErrorMessage>
                    {errors.reference?.message}
                  </FormErrorMessage>
                </FormControl>
              </GridItem>
            </Grid>
          </Box>
          <Flex justify="flex-end" mt={6}>
            <Button
              size="lg"
              isLoading={updating}
              colorScheme="cyan"
              type="submit"
            >
              save
            </Button>
          </Flex>
        </Box>
      </FormProvider>
    </Box>
  );
}

SaleReceiptForm.propTypes = {
  ...SaleReceiptFormPropTypes,
};
