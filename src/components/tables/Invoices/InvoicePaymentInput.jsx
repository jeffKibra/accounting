import { Controller, useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';
//
import ControlledNumInput from 'components/ui/ControlledNumInput';
//

function InvoicePaymentInput(props) {
  const { formIsDisabled, invoiceId, paymentTotal, balance } = props;

  const { control } = useFormContext();

  const max = Math.min(paymentTotal, balance);

  return (
    <Controller
      name={`payments.${invoiceId}`}
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
            size="sm"
          />
        );
      }}
    />
  );
}

InvoicePaymentInput.propTypes = {
  formIsDisabled: PropTypes.bool.isRequired,
  invoiceId: PropTypes.string.isRequired,
  paymentTotal: PropTypes.number,
  balance: PropTypes.number,
};

export default InvoicePaymentInput;
