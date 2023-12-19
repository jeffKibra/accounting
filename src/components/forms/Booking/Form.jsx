import { useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Flex, Button } from '@chakra-ui/react';
import { useForm, FormProvider } from 'react-hook-form';
import PropTypes from 'prop-types';

import { confirmFutureDate } from 'utils/dates';
import { Bookings } from 'utils/bookings';
//
import { useToasts } from 'hooks';
//
import { bookingFormProps } from 'propTypes';
//
//
import BookingDaysSelector from 'components/Custom/Bookings/BookingDaysSelector';
import SelectVehicle from 'components/Custom/Bookings/SelectVehicle';
//
import DetailsFields from './DetailsFields';

function convertDateToString(date) {
  return date ? new Date(date).toDateString() : '';
}

function Form(props) {
  const {
    booking,
    onSubmit,
    updating,
    paymentModes,
    paymentTerms,
    customers,
    taxes,
  } = props;
  // console.log({ booking });

  const location = useLocation();
  const navigate = useNavigate();

  const defaultSelectedDates = Array.isArray(booking?.selectedDates)
    ? booking.selectedDates
    : [];

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: {
      //booking values
      startDate: new Date(booking?.startDate || Date.now()),
      endDate: new Date(booking?.endDate || Date.now()),
      selectedDatesString: defaultSelectedDates.join(','),
      daysCount: defaultSelectedDates?.length || 0,
      vehicle: booking?.vehicle || null,
      // quantity: booking?.quantity || 0,
      bookingRate: booking?.bookingRate || 0,
      bookingTotal: booking?.bookingTotal || 0,
      transferFee: booking?.transferFee || 0,
      total: booking?.total || 0,
      //  itemTax: 0,
      //   itemRateTotal: 0,
      //   itemTaxTotal: 0,
      //   salesTax: null,
      // taxType: 'taxExclusive',
      //
      customer: booking?.customer || '',
      // paymentTerm: booking?.paymentTerm?.value || 'on_receipt',
      downPayment: booking?.downPayment || {
        amount: 0,
        paymentMode: null,
        reference: '',
      },
      // saleDate: new Date(booking?.saleDate || today),
      // dueDate: new Date(booking?.dueDate || today),
      //
      // queryVariables: booking?.queryVariables || null,
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
  const selectedDatesString = watch('selectedDatesString');
  const selectedVehicle = watch('vehicle');
  // console.log({ selectedVehicle });

  const startDateString = convertDateToString(startDate);
  const endDateString = convertDateToString(endDate);

  // console.log({ selectedDatesString });

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

    const incomingSelectedDatesString = incomingSelectedDates.join(',');

    //update selectedDates field
    setValue('selectedDatesString', incomingSelectedDatesString, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue('daysCount', incomingSelectedDates?.length, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  }, [startDateString, endDateString, setValue, clearErrors, toastError]);

  const handleFormSubmit = useCallback(
    data => {
      console.log('submitting...', data);
      delete data.queryVariables;
      delete data.daysCount;

      const { selectedDatesString } = data;
      //submit the data
      onSubmit({
        ...data,
        selectedDates: String(selectedDatesString).split(','),
      });
    },
    [onSubmit]
  );
  //
  const handleVehicleSelect = useCallback(
    (incomingVehicle, incomingQueryVariables) => {
      // console.log({ item });
      const rate = incomingVehicle?.rate || 0;

      setValue('vehicle', incomingVehicle);
      // //update rate and reset transfer rate
      setValue('bookingRate', rate, {
        /**
         * setting should validate to true triggers unnecessary updates
         */
        // shouldValidate: true,
        shouldDirty: true,
      });

      // setValue('queryVariables', incomingQueryVariables);
    },
    [setValue]
  );

  //
  const { pathname } = location;

  function prev() {
    console.log('prev clicked');

    navigate(`${pathname}?stage=1`);
  }

  function next() {
    console.log('next clicked');

    navigate(`${pathname}?stage=2`);
  }

  // console.log({ customers, items, paymentTerms, loading });

  //----------------------------------------------------------------

  const searchString = location.search || '';
  // console.log({ searchString });
  const searchParams = new URLSearchParams(searchString);
  const stage = searchParams.get('stage');
  // console.log({ stage });

  //----------------------------------------------------------------
  const isDetailsPage = stage === '2' && Boolean(selectedVehicle?._id);

  //----------------------------------------------------------------

  return (
    <Card>
      <FormProvider {...formMethods}>
        <Box
          as="form"
          role="form"
          onSubmit={handleSubmit(handleFormSubmit)}
          w="full"
        >
          <Box w="full" rowGap={4}>
            {isDetailsPage ? (
              <>
                <DetailsFields
                  customers={customers}
                  paymentTerms={paymentTerms}
                  loading={updating}
                  bookingId={booking?.id || ''}
                  taxes={taxes}
                  // vehicle={selectedVehicle}
                  paymentModes={paymentModes}
                  currentBookingDetails={booking || null}
                />

                <Flex w="full" pb={6} pt={2} px={4} justify="space-between">
                  <Button
                    type="button"
                    colorScheme="cyan"
                    size="lg"
                    isLoading={updating}
                    onClick={prev}
                  >
                    prev
                  </Button>

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
                  bg="#f4f6f8"
                  // mx={-4}
                  // mt={-4}
                  px={4}
                  pt={4}
                  borderTopLeftRadius="lg"
                  borderTopRightRadius="lg"
                >
                  <BookingDaysSelector isEditing />
                </Box>
              </>
            )}
          </Box>
        </Box>
      </FormProvider>

      {isDetailsPage ? null : (
        <Box p={4}>
          <SelectVehicle
            bookingId={booking?._id}
            watch={watch}
            selectedVehicle={selectedVehicle}
            onSelect={handleVehicleSelect}
            selectedDatesString={selectedDatesString}
          />

          <Flex w="full" justifyContent="flex-end" pt={4}>
            <Button type="button" colorScheme="cyan" size="lg" onClick={next}>
              next
            </Button>
          </Flex>
        </Box>
      )}
    </Card>
  );
}

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  updating: PropTypes.bool.isRequired,
  booking: bookingFormProps,
  paymentModes: PropTypes.object,
  paymentTerms: PropTypes.array,
  customers: PropTypes.array,
  taxes: PropTypes.array,
};

export default Form;

function Card({ children }) {
  return (
    <Box
      w="full"
      mt={2}
      // p={4}
      // pb={4}
      bg="white"
      borderRadius="lg"
      shadow="lg"
      border="1px solid"
      borderColor="gray.200"
    >
      {children}
    </Box>
  );
}
