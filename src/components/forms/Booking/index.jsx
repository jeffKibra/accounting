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

//
import BookingDaysSelector from './Components/BookingDaysSelector';

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

  const toasts = useToasts();

  // console.log({
  //   dirtyFields,
  //   isDirty,
  //   totalAmount: booking?.summary?.totalAmount,
  // });

  // console.log({ customers, items, paymentTerms, loading });

  return loading ? (
    <SkeletonLoader />
  ) : customers?.length > 0 ? (
    <BookingDaysSelector />
  ) : (
    <Empty message="Please add atleast one CUSTOMER to continue or reload the page" />
  );
}
BookingForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  updating: PropTypes.bool.isRequired,
  booking: bookingFormProps,
};

export default BookingForm;
