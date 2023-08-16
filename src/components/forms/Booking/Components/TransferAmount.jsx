import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { useFormContext, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
//
import ControlledNumInput from 'components/ui/ControlledNumInput';
//
import { NumberDisplay } from './CustomDisplays';

function TransferAmount(props) {
  const { loading, isEditing } = props;

  const {
    formState: { errors },
    control,
  } = useFormContext();

  const label = 'Transfer Amount';

  return (
    <FormControl isInvalid={errors?.transferAmount}>
      <Controller
        name="transferAmount"
        rules={{
          required: { value: true, message: '* Required!' },
        }}
        control={control}
        render={({ field: { value, ref, onBlur, onChange } }) => {
          return isEditing ? (
            <>
              <FormLabel fontSize="14px" htmlFor="transferAmount">
                {label}
              </FormLabel>
              <ControlledNumInput
                ref={ref}
                updateFieldMode="onBlur"
                value={value}
                mode="onBlur"
                onChange={onChange}
                onBlur={onBlur}
                min={0}
                isReadOnly={loading}
              />
            </>
          ) : (
            <NumberDisplay title={label} value={value} />
          );
        }}
      />

      <FormErrorMessage>{errors?.transferAmount?.message}</FormErrorMessage>
    </FormControl>
  );
}

TransferAmount.propTypes = {
  loading: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool,
};

export default TransferAmount;
