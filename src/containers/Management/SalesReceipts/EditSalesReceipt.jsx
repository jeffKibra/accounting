import { useEffect } from 'react';
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
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useForm, FormProvider } from 'react-hook-form';

import { GET_PAYMENT_MODES } from '../../../store/actions/paymentModesActions';
//hooks
import { useGetSalesProps } from '../../../hooks';
//ui
import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import Empty from '../../../components/ui/Empty';
import CustomSelect from '../../../components/ui/CustomSelect';
import CustomDatePicker from '../../../components/ui/CustomDatePicker';

import EditSale from '../Sales/EditSale';
// import SaleItemsForm from "../../../components/forms/Sales/SaleItemsForm";

function EditSalesReceipt(props) {
  const {
    salesReceipt,
    handleFormSubmit,
    updating,
    getPaymentModes,
    loadingPaymentModes,
    paymentModes,
    accounts,
  } = props;
  // console.log({ props });
  const { customers, items, taxes, loading } = useGetSalesProps();

  const paymentAccounts = accounts?.filter(account => {
    const {
      accountType: { id },
      tags,
    } = account;
    const index = tags.findIndex(tag => tag === 'receivable');

    return id === 'cash' && index > -1;
  });

  const today = new Date();

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: {
      customerId: salesReceipt?.customer?.customerId || '',
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

  useEffect(() => {
    getPaymentModes();
  }, [getPaymentModes]);

  function onSubmit(data) {
    let { customerId, paymentModeId, accountId, ...rest } = data;
    let customer = null;
    if (customerId) {
      customer = customers.find(customer => customer.id === customerId);
    }

    const paymentMode = paymentModes.find(mode => mode.value === paymentModeId);
    const account = paymentAccounts.find(
      account => account.accountId === accountId
    );
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

  return loadingPaymentModes || loading ? (
    <SkeletonLoader />
  ) : paymentModes?.length > 0 ? (
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
                      const { customerId, displayName } = customer;

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
              <EditSale loading={updating} items={items} taxes={taxes} />
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
                    groupedOptions={paymentAccounts.map(account => {
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
  ) : (
    <Empty message="Payment modes not found! Please try Reloading the page!" />
  );
}

EditSalesReceipt.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  updating: PropTypes.bool.isRequired,
  invoice: PropTypes.shape({
    summary: PropTypes.shape({
      shipping: PropTypes.number,
      adjustment: PropTypes.number,
      totalTax: PropTypes.number,
      totalAmount: PropTypes.number,
      subTotal: PropTypes.number,
      taxes: PropTypes.array,
    }),
    selectedItems: PropTypes.array,
    customerId: PropTypes.string,
    invoiceDate: PropTypes.instanceOf(Date),
    dueDate: PropTypes.instanceOf(Date),
    subject: PropTypes.string,
    customerNotes: PropTypes.string,
    invoiceSlug: PropTypes.string,
    invoiceId: PropTypes.string,
  }),
};

function mapStateToProps(state) {
  const { loading: loadingPaymentModes, paymentModes } =
    state.paymentModesReducer;
  const { accounts } = state.accountsReducer;

  return {
    loadingPaymentModes,
    paymentModes,
    accounts,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getPaymentModes: () => dispatch({ type: GET_PAYMENT_MODES }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditSalesReceipt);
