import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Flex,
  IconButton,
} from '@chakra-ui/react';
import { useFormContext, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import { RiRefreshLine } from 'react-icons/ri';
//
import ControlledNumInput from 'components/ui/ControlledNumInput';
//
import { NumberDisplay } from './CustomDisplays';

function BookingRate(props) {
  const {
    loading,
    isEditing,
    // transactionId,
  } = props;
 

  const {
    formState: { errors },
    control,
    watch,
  } = useFormContext();

  const item = watch('item');

  const label = 'Rate';

  return (
    <FormControl isInvalid={errors?.bookingRate}>
      <Controller
        name="bookingRate"
        rules={{
          required: { value: true, message: '* Required!' },
        }}
        control={control}
        render={({ field: { value, ref, onBlur, onChange } }) => {
          function handleReset() {
            onChange(item?.rate);
          }

          return isEditing ? (
            <>
              <FormLabel fontSize="14px" htmlFor="bookingRate">
                {label}
              </FormLabel>
              <Flex w="full">
                <ControlledNumInput
                  ref={ref}
                  updateFieldMode="onBlur"
                  value={value}
                  mode="onBlur"
                  onChange={onChange}
                  onBlur={onBlur}
                  min={1}
                  isReadOnly={loading}
                  w="full"
                />
                <IconButton
                  onClick={handleReset}
                  title="Reset Car Rate"
                  icon={<RiRefreshLine />}
                />
              </Flex>
            </>
          ) : (
            <NumberDisplay title={label} value={value} />
          );
        }}
      />

      <FormErrorMessage>{errors?.bookingRate?.message}</FormErrorMessage>
    </FormControl>
  );
}

BookingRate.propTypes = {
  loading: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool,
};

export default BookingRate;
