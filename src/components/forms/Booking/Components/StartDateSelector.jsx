import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { useFormContext, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
//
import { confirmFutureDate } from 'utils/dates';
//
//
import ControlledDatePicker from 'components/ui/ControlledDatePicker';

import { DateDisplay } from './CustomDisplays';

//----------------------------------------------------------------

StartDateSelector.propTypes = {
  loading: PropTypes.bool,
  isEditing: PropTypes.bool,
  loadSchedules: PropTypes.bool,
  itemId: PropTypes.string,
  preselectedDates: PropTypes.array,
};

export default function StartDateSelector(props) {
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
    setValue,
  } = useFormContext();

  //   console.log({ errors });

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  return (
    <FormControl isDisabled={loading} isRequired isInvalid={errors.startDate}>
      <Controller
        name="startDate"
        control={control}
        render={({ field: { name, onBlur, onChange, ref, value } }) => {
          function handleChange(incomingStartDateValue) {
            //update form value immediately
            onChange(incomingStartDateValue);

            //validate end date-
            const endDateValue = getValues('endDate');

            const incomingStartDate = new Date(
              incomingStartDateValue || new Date()
            );
            const endDate = new Date(endDateValue || new Date());

            const endDateIsValid = confirmFutureDate(
              incomingStartDate,
              endDate
            );

            if (!endDateIsValid) {
              setValue('endDate', incomingStartDate, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              });
            }
          }

          return isEditing ? (
            <>
              <FormLabel fontSize="14px" htmlFor="startDate">
                Pickup Date
              </FormLabel>

              <ControlledDatePicker
                ref={ref}
                name={name}
                onBlur={onBlur}
                onChange={handleChange}
                value={value}
                required
                isReadOnly={loading}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                itemId={itemId}
                loadSchedules={loadSchedules}
                preselectedDates={preselectedDates}
                {...datePickerProps}
                // renderDayContents={(day, date) => {
                //   console.log({ day, date });
                //   return day === 13 ? (
                //     <Flex direction="column" alignItems="center">
                //       <Spinner />
                //       <Text>Loading Month Schedule...</Text>
                //     </Flex>
                //   ) : null;
                // }}
              />
            </>
          ) : (
            <DateDisplay title="Pickup Date" value={startDate} />
          );
        }}
      />

      <FormErrorMessage>{errors.startDate?.message}</FormErrorMessage>
    </FormControl>
  );
}
