import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react';
import { useFormContext, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
//
import { confirmFutureDate } from 'utils/dates';
//
import ControlledDatePicker from 'components/ui/ControlledDatePicker';
import { DateDisplay } from './CustomDisplays';

//----------------------------------------------------------------

EndDateSelector.propTypes = {
  loading: PropTypes.bool,
  isEditing: PropTypes.bool,
  loadSchedules: PropTypes.bool,
  itemId: PropTypes.string,
  preselectedDates: PropTypes.array,
};

EndDateSelector.defaultProps = {};

export default function EndDateSelector(props) {
  const {
    isEditing,
    loading,
    itemId,
    loadSchedules,
    preselectedDates,
    ...datePickerProps
  } = props;

  const {
    formState: { errors },
    watch,
    control,
    getValues,
  } = useFormContext();

  //   console.log({ errors });

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  // const selectedDates = watch('selectedDates');
  //   console.log({ selectedDates });
  const days = watch('daysCount');

  return (
    <FormControl isDisabled={loading} isRequired isInvalid={errors.endDate}>
      <Controller
        name="endDate"
        control={control}
        rules={{
          validate: endDateVal => {
            const startDateVal = getValues('startDate');
            // console.log({ endDateVal, startDateVal });

            const endDateIsValid = confirmFutureDate(
              new Date(startDateVal || new Date()),
              new Date(endDateVal || new Date())
            );

            return (
              endDateIsValid ||
              'Return date must be either same day or ahead of Pickup date'
            );
          },
        }}
        render={({ field: { name, onBlur, onChange, ref, value } }) => {
          return isEditing ? (
            <>
              <FormLabel fontSize="14px" htmlFor="endDate">
                Return Date
              </FormLabel>{' '}
              <ControlledDatePicker
                name={name}
                ref={ref}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                required
                isReadOnly={loading}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                itemId={itemId}
                loadSchedules={loadSchedules}
                preselectedDates={preselectedDates}
                {...datePickerProps}
              />
            </>
          ) : (
            <DateDisplay title="Return Date" value={endDate} />
          );
        }}
      />

      <FormErrorMessage>{errors.endDate?.message}</FormErrorMessage>

      <FormHelperText>{`${days || ''} ${
        days ? `day${days > 1 ? 's' : ''} selected` : ''
      }`}</FormHelperText>
    </FormControl>
  );
}
