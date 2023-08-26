import { useSelector } from 'react-redux';
import { FormControl, FormErrorMessage } from '@chakra-ui/react';
import { useFormContext, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
//
import { Bookings } from 'utils/bookings';

//----------------------------------------------------------------

SelectedDates.propTypes = {
  loading: PropTypes.bool,
  itemId: PropTypes.string,
  preselectedDates: PropTypes.array,
};

SelectedDates.defaultProps = {
  preselectedDates: [],
};

export default function SelectedDates(props) {
  const { loading, itemId, preselectedDates } = props;

  const monthlyBookings = useSelector(
    state => state?.monthlyBookingsReducer?.monthlyBookings
  );

  const {
    formState: { errors },
    control,
  } = useFormContext();

  //   console.log({ errors });

  return (
    <FormControl
      isDisabled={loading}
      isRequired
      isInvalid={errors?.selectedDates}
    >
      <Controller
        name="selectedDates"
        control={control}
        rules={{
          validate: val => {
            // console.log({ val });

            const atleastOneDateIsInRange =
              Bookings.checkIfAnAlreadyBookedDateIsInRange(
                itemId,
                val,
                monthlyBookings,
                preselectedDates
              );

            console.log({ atleastOneDateIsInRange });

            return (
              !atleastOneDateIsInRange ||
              'Some of the selected dates have already been booked!'
            );
          },
        }}
        render={() => {
          return (
            <>
              <FormErrorMessage>
                {errors?.selectedDates?.message}
              </FormErrorMessage>
            </>
          );
        }}
      />
    </FormControl>
  );
}
