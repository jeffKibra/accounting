import { Box, Flex, Button } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useForm, FormProvider } from 'react-hook-form';

import formats from 'utils/formats';
import { confirmFutureDate } from 'utils/dates';
import { useToasts, useGetSalesProps } from 'hooks';

import SkeletonLoader from 'components/ui/SkeletonLoader';
import Empty from 'components/ui/Empty';

import InvoiceDetailsFields from './DetailsFields';

import ItemsLoader from '../Booking/ItemsLoader';

function InvoiceForm(props) {
  const { invoice, handleFormSubmit, updating } = props;
  console.log({ invoice });

  const { loading, items, customers, paymentTerms, taxes } = useGetSalesProps();

  const today = new Date();
  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: {
      //booking values
      dateRange: invoice?.dateRange
        ? [new Date(invoice?.dateRange[0]), new Date(invoice?.dateRange[1])]
        : [],
      item: invoice?.item || null,
      quantity: invoice?.quantity || 0,
      bookingRate: invoice?.bookingRate || 0,
      bookingTotal: invoice?.bookingTotal || 0,
      transferAmount: invoice?.transferAmount || 0,
      total: invoice?.total || 0,
      //  itemTax: 0,
      //   itemRateTotal: 0,
      //   itemTaxTotal: 0,
      //   salesTax: null,
      // taxType: 'taxExclusive',
      //
      customer: invoice?.customer?.id || '',
      saleDate: new Date(invoice?.saleDate || today),
      paymentTerm: invoice?.paymentTerm?.value || 'on_receipt',
      dueDate: new Date(invoice?.dueDate || today),
      //
      // subject: invoice?.subject || '',
      // orderNumber: invoice?.orderNumber || '',
      // customerNotes: invoice?.customerNotes || '',
    },
  });
  const { handleSubmit } = formMethods;

  const toasts = useToasts();

  // console.log({
  //   dirtyFields,
  //   isDirty,
  //   totalAmount: invoice?.summary?.totalAmount,
  // });

  function onSubmit(data) {
    console.log({ data });
    const { customer: customerId, paymentTerm: paymentTermId, ...rest } = data;
    const { saleDate, dueDate } = rest;
    let formValues = { ...rest };

    // if (totalAmount <= 0) {
    //   return toasts.error("Total Sale Amount should be greater than ZERO(0)!");
    // }

    /**
     * ensure dueDate is not a past date
     */
    const dueDateIsFuture = confirmFutureDate(saleDate, dueDate);
    if (!dueDateIsFuture) {
      return toasts.error(
        'Due date must be either same day or ahead of invoice date'
      );
    }

    const customer = customers.find(customer => customer.id === customerId);
    if (!customer) {
      return toasts.error('Selected an Invalid customer');
    }
    formValues.customer = formats.formatCustomerData(customer);

    const paymentTerm = paymentTerms.find(term => term.value === paymentTermId);
    if (!paymentTerm) {
      return toasts.error('Selected Payment Term is not a valid Payment Term');
    }
    formValues.paymentTerm = paymentTerm;

    // if (invoice) {
    //   //invoice is being updated-submit only the changed values
    //   formValues = getDirtyFields(dirtyFields, formValues);
    // }
    console.log({ formValues });

    //submit the data
    handleFormSubmit(formValues);
  }

  // console.log({ customers, items, paymentTerms, loading });

  return loading ? (
    <SkeletonLoader />
  ) : customers?.length > 0 && items?.length > 0 && paymentTerms?.length > 0 ? (
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
          <ItemsLoader
            items={items}
            loading={updating}
            taxes={taxes}
            defaultDateRange={invoice?.dateRange}
            defaultItemId={invoice?.item?.itemId}
          >
            {availableItems => {
              console.log({ availableItems });

              return (
                <InvoiceDetailsFields
                  customers={customers}
                  paymentTerms={paymentTerms}
                  loading={updating}
                  invoiceId={invoice?.invoiceId || ''}
                  items={availableItems}
                  taxes={taxes}
                />
              );
            }}
          </ItemsLoader>

          {/* <SaleItems
            loading={updating}
            items={items}
            taxes={taxes}
            selectSalesType={!Boolean(invoice)}
            transactionId={invoice?.invoiceId}
            transactionType={"invoice"}
          /> */}
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
  ) : items?.length === 0 ? (
    <Empty message="Please add atleast one ITEM to continue or reload the page" />
  ) : customers?.length === 0 ? (
    <Empty message="Please add atleast one CUSTOMER to continue or reload the page" />
  ) : (
    <Empty message="Payment Terms not Found. Try Reloading the page" />
  );
}
InvoiceForm.propTypes = {
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
    saleDate: PropTypes.instanceOf(Date),
    dueDate: PropTypes.instanceOf(Date),
    subject: PropTypes.string,
    customerNotes: PropTypes.string,
    invoiceId: PropTypes.string,
  }),
};

export default InvoiceForm;
