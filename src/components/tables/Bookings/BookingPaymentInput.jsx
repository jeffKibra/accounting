import { Controller, useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';
//
import ControlledNumInput from 'components/ui/ControlledNumInput';
//

function BookingPaymentInput(props) {
  const { formIsDisabled, booking, paymentTotal, balance } = props;
  const { id: bookingId } = booking;

  const { control } = useFormContext();

  const max = Math.min(paymentTotal, balance);

  return (
    <Controller
      name={`payments.${bookingId}`}
      control={control}
      render={({ field: { ref, onChange, onBlur, value } }) => {
        return (
          <ControlledNumInput
            ref={ref}
            mode="onBlur"
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            min={0}
            max={max}
            isDisabled={formIsDisabled}
          />
        );
      }}
    />
  );
}

BookingPaymentInput.propTypes = {
  formIsDisabled: PropTypes.bool.isRequired,
  booking: PropTypes.object.isRequired,
  paymentTotal: PropTypes.number,
  balance: PropTypes.number,
};

export default BookingPaymentInput;
