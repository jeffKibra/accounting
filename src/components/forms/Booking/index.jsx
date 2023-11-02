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
    customers,
    // items,
    taxes,
    loading,
  } = useGetBookingFormProps();

  const { error: toastError } = useToasts();

  // console.log({ selectedDates });

  function handleSubmit(data) {
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

    console.log({ formValues });

    // if (booking) {
    //   //booking is being updated-submit only the changed values
    //   formValues = getDirtyFields(dirtyFields, formValues);
    // }
    // console.log({ formValues });

    //submit the data
    // handleFormSubmit(formValues);
  }

  // console.log({ customers, items, paymentTerms, loading });

  return loading ? (
    <SkeletonLoader />
  ) : customers?.length > 0 && paymentTerms?.length > 0 ? (
    <BookingFormContextProvider savedData={booking}>
      <Form
        onSubmit={handleSubmit}
        booking={booking}
        updating={updating}
        paymentModes={paymentModes}
        paymentTerms={paymentTerms}
        customers={customers}
        taxes={taxes}
        loading={loading}
      />
    </BookingFormContextProvider>
  ) : (
    <Empty
      message={
        customers?.length === 0
          ? 'Please add atleast one CUSTOMER to continue or reload the page'
          : 'Payment Terms not Found. Try Reloading the page'
      }
    />
  );
}
BookingForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  updating: PropTypes.bool.isRequired,
  booking: bookingFormProps,
};

export default BookingForm;
