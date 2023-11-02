import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { useFormContext, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
//
import ControlledNumInput from 'components/ui/ControlledNumInput';
//
import { NumberDisplay } from './CustomDisplays';

function TransferFee(props) {
  const { loading, isEditing } = props;

  const {
    formState: { errors },
    control,
  } = useFormContext();

  const label = 'Transfer Fee';

  return (
    <FormControl isInvalid={errors?.transferFee}>
      <Controller
        name="transferFee"
        rules={{
          required: { value: true, message: '* Required!' },
        }}
        control={control}
        render={({ field: { value, ref, onBlur, onChange } }) => {
          return isEditing ? (
            <>
              <FormLabel fontSize="14px" htmlFor="transferFee">
                {label}
              </FormLabel>
              <ControlledNumInput
                key="transferFee"
                id="transferFee"
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

      <FormErrorMessage>{errors?.transferFee?.message}</FormErrorMessage>
    </FormControl>
  );
}

TransferFee.propTypes = {
  loading: PropTypes.bool,
  isEditing: PropTypes.bool,
};

export default TransferFee;
