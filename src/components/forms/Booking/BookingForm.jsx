import { Box, Flex, Button } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useForm, FormProvider } from 'react-hook-form';

import formats from 'utils/formats';
import { confirmFutureDate } from 'utils/dates';
import { useToasts, useGetBookingFormProps } from 'hooks';
//
import { bookingFormProps } from 'propTypes';

import SkeletonLoader from 'components/ui/SkeletonLoader';
import Empty from 'components/ui/Empty';

import DetailsFields from './DetailsFields';

import ItemsLoader from '../Sales/ItemsLoader';

function BookingForm(props) {
  const { booking, handleFormSubmit, updating } = props;
  // console.log({ booking });

  const {
    // accounts,
    paymentModes,
    paymentTerms,
    customers,
    items,
    taxes,
    loading,
  } = useGetBookingFormProps();

  const today = new Date();
  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: {
      //booking values
      startDate: new Date(booking?.startDate || Date.now()),
      endDate: new Date(booking?.endDate || Date.now()),
      item: booking?.item || null,
      quantity: booking?.quantity || 0,
      bookingRate: booking?.bookingRate || 0,
      bookingTotal: booking?.bookingTotal || 0,
      transferAmount: booking?.transferAmount || 0,
      total: booking?.total || 0,
      //  itemTax: 0,
      //   itemRateTotal: 0,
      //   itemTaxTotal: 0,
      //   salesTax: null,
      // taxType: 'taxExclusive',
      //
      customer: booking?.customer?.id || '',
      saleDate: new Date(booking?.saleDate || today),
      paymentTerm: booking?.paymentTerm?.value || 'on_receipt',
      dueDate: new Date(booking?.dueDate || today),
      downPayment: booking?.downPayment || {
        amount: 0,
        paymentMode: null,
        reference: '',
      },
      //
      // subject: booking?.subject || '',
      // orderNumber: booking?.orderNumber || '',
      // customerNotes: booking?.customerNotes || '',
    },
  });
  const { handleSubmit } = formMethods;

  const toasts = useToasts();

  // console.log({
  //   dirtyFields,
  //   isDirty,
  //   totalAmount: booking?.summary?.totalAmount,
  // });

  function onSubmit(data) {
    // console.log({ data });
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
        'Due date must be either same day or ahead of booking date'
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

    // if (booking) {
    //   //booking is being updated-submit only the changed values
    //   formValues = getDirtyFields(dirtyFields, formValues);
    // }
    // console.log({ formValues });

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
            defaultStartDate={booking?.startDate}
            defaultEndDate={booking?.endDate}
            defaultItemId={booking?.item?.itemId}
          >
            {availableItems => {
              // console.log({ availableItems });

              return (
                <DetailsFields
                  customers={customers}
                  paymentTerms={paymentTerms}
                  loading={updating}
                  bookingId={booking?.id || ''}
                  items={availableItems}
                  taxes={taxes}
                  paymentModes={paymentModes}
                />
              );
            }}
          </ItemsLoader>

          {/* <SaleItems
            loading={updating}
            items={items}
            taxes={taxes}
            selectSalesType={!Boolean(booking)}
            transactionId={booking?.bookingId}
            transactionType={"booking"}
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
BookingForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  updating: PropTypes.bool.isRequired,
  booking: bookingFormProps,
};

export default BookingForm;
