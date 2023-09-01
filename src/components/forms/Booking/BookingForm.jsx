import { useEffect } from 'react';
import { Box, Flex, Button } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useForm, FormProvider } from 'react-hook-form';

import formats from 'utils/formats';
import { confirmFutureDate } from 'utils/dates';
import { Bookings } from 'utils/bookings';
//
import { useToasts, useGetBookingFormProps } from 'hooks';
//
import { bookingFormProps } from 'propTypes';
//
import { BookingFormContextProvider } from 'contexts/BookingFormContext';
//

import SkeletonLoader from 'components/ui/SkeletonLoader';
import Empty from 'components/ui/Empty';
//
import BookingDaysSelector from 'components/Custom/Bookings/BookingDaysSelector';
import SelectItem from 'components/Custom/Bookings/SelectItem';
//
import DetailsFields from './DetailsFields';

function convertDateToString(date) {
  return date ? new Date(date).toDateString() : '';
}

function BookingForm(props) {
  const { booking, handleFormSubmit, updating } = props;
  // console.log({ booking });

  const {
    // accounts,
    paymentModes,
    paymentTerms,
    customers,
    // items,
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
      selectedDates: booking?.selectedDates || [],
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

  const { error: toastError } = useToasts();

  const { handleSubmit, watch, setValue, clearErrors } = formMethods;

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const selectedItem = watch('item');
  const selectedDates = watch('selectedDates');

  const startDateString = convertDateToString(startDate);
  const endDateString = convertDateToString(endDate);

  // console.log({ selectedDates });

  useEffect(() => {
    //validate fields
    // console.log('updating selected dates');
    let incomingSelectedDates = [];

    try {
      if (startDateString && endDateString) {
        const validStartDate = new Date(startDateString || new Date());
        const validEndDate = new Date(endDateString || new Date());

        const endDateIsFutureDate = confirmFutureDate(
          validStartDate,
          validEndDate
        );

        if (endDateIsFutureDate) {
          //derives all selected dates from startDate and endDate
          const bookingDays = Bookings.getBookingDays(
            validStartDate,
            validEndDate
          );
          // console.log({ bookingDays });
          const { ungroupedDates } = bookingDays;

          incomingSelectedDates = ungroupedDates;
        }
      }
    } catch (error) {
      console.error(error);
      toastError(
        `Error Generating Dates-in-Range: ${error?.message || 'Unknown Error!'}`
      );
    }

    //update selectedDates field
    setValue('selectedDates', incomingSelectedDates, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  }, [startDateString, endDateString, setValue, clearErrors, toastError]);

  useEffect(() => {
    console.log('selectedDates have changed', selectedDates);
  }, [selectedDates]);

  function onSubmit(data) {
    console.log('submitting...', data);
    // console.log({ data });
    const { customer: customerId, paymentTerm: paymentTermId, ...rest } = data;
    const { total } = rest;
    let formValues = { ...rest };

    if (total < 0) {
      return toastError('Total Sale Amount should not be less than ZERO(0)!');
    }

    // /**
    //  * ensure dueDate is not a past date
    //  */
    // const dueDateIsFuture = confirmFutureDate(startDate, endDate);
    // console.log({ dueDateIsFuture });
    // if (!dueDateIsFuture) {
    //   //update form errors
    //   setFutureDateError();
    //   return toasts.error(futureDateErrorMsg);
    // }

    const customer = customers.find(customer => customer.id === customerId);
    if (!customer) {
      return toastError('Selected an Invalid customer');
    }
    formValues.customer = formats.formatCustomerData(customer);

    const paymentTerm = paymentTerms.find(term => term.value === paymentTermId);
    if (!paymentTerm) {
      return toastError('Selected Payment Term is not a valid Payment Term');
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
  ) : customers?.length > 0 && paymentTerms?.length > 0 ? (
    <FormProvider {...formMethods}>
      <BookingFormContextProvider savedData={booking}>
        <Box as="form" role="form" onSubmit={handleSubmit(onSubmit)} w="full">
          <Box w="full" rowGap={4}>
            {selectedItem ? (
              <>
                <Box
                  w="full"
                  mt={2}
                  p={4}
                  pb={4}
                  bg="white"
                  borderRadius="lg"
                  shadow="lg"
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <DetailsFields
                    customers={customers}
                    paymentTerms={paymentTerms}
                    loading={updating}
                    bookingId={booking?.id || ''}
                    taxes={taxes}
                    item={selectedItem}
                    paymentModes={paymentModes}
                    currentBookingDetails={booking || null}
                  />
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
              </>
            ) : (
              <>
                <Box
                  w="full"
                  mt={2}
                  p={4}
                  pb={4}
                  bg="white"
                  borderRadius="lg"
                  shadow="lg"
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <Box
                    bg="#f4f6f8"
                    mx={-4}
                    mt={-4}
                    px={4}
                    pt={4}
                    borderTopLeftRadius="lg"
                    borderTopRightRadius="lg"
                  >
                    <BookingDaysSelector isEditing />
                  </Box>

                  <Box pt={4}>
                    <SelectItem selectedDates={selectedDates} />
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </BookingFormContextProvider>
    </FormProvider>
  ) : // : items?.length === 0 ? (
  //   <Empty message="Please add atleast one ITEM to continue or reload the page" />
  // )
  customers?.length === 0 ? (
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
