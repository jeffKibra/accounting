import PropTypes from 'prop-types';
//
import formats from 'utils/formats';

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

//
import Form from './Form';

// function convertDateToString(date) {
//   return date ? new Date(date).toDateString() : '';
// }

function BookingForm(props) {
  const { booking, onSubmit, updating } = props;
  // console.log({ booking });

  const {
    // accounts,
    paymentModes,
    paymentTerms,
    // items,
    taxes,
    loading,
  } = useGetBookingFormProps();
  // console.log({ customers, paymentModes, paymentTerms, taxes, loading });

  const { error: toastError } = useToasts();

  // console.log({ selectedDates });

  function handleSubmit(data) {
    console.log('submitting...', data);
    // console.log({ data });
    const { ...rest } = data;

    const { total } = rest;

    if (total < 0) {
      return toastError('Total Sale Amount should not be less than ZERO(0)!');
    }

    let formValues = { ...rest };

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

    

    // const paymentTerm = paymentTerms.find(term => term.value === paymentTermId);
    // if (!paymentTerm) {
    //   return toastError('Selected Payment Term is not a valid Payment Term');
    // }
    // formValues.paymentTerm = paymentTerm;

    console.log({ formValues });

    // if (booking) {
    //   //booking is being updated-submit only the changed values
    //   formValues = getDirtyFields(dirtyFields, formValues);
    // }
    // console.log({ formValues });

    //submit the data
    onSubmit(formValues);
  }

  // console.log({ customers, items, paymentTerms, loading });

  return loading ? (
    <SkeletonLoader />
  ) : paymentTerms?.length > 0 ? (
    <BookingFormContextProvider savedData={booking}>
      <Form
        onSubmit={handleSubmit}
        booking={booking}
        updating={updating}
        paymentModes={paymentModes}
        paymentTerms={paymentTerms}
        taxes={taxes}
        loading={loading}
      />
    </BookingFormContextProvider>
  ) : (
    <Empty
      message=
         'Payment Terms not Found. Try Reloading the page'
      
    />
  );
}

BookingForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  updating: PropTypes.bool.isRequired,
  booking: bookingFormProps,
};

export default BookingForm;
