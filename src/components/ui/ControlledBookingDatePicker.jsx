import { forwardRef } from 'react';
import { Box, Spinner, Text } from '@chakra-ui/react';
import PropTypes from 'prop-types';

//
import CustomAlert from './CustomAlert';
//
import ControlledDefaultDatePicker, {
  ControlledDefaultDatePickerPropTypes,
} from './ControlledDefaultDatePicker';

//----------------------------------------------------------------

const ControlledBookingDatePicker = forwardRef((props, ref) => {
  // console.log({ props });
  const {
    loading,
    error,
    showFooter,
    wrapperCSS,
    bookedDates,
    ...datePickerProps
  } = props;
  // console.log({ datePickerProps });

  return (
    <Box
      w="full"
      __css={{
        ...(loading
          ? {
              '& div.react-datepicker__month': {
                display: 'none',
              },
            }
          : {}),
        '& div.react-datepicker__day--highlighted': {
          borderBottom: '2px solid red',
          backgroundColor: 'transparent',
        },
        ...(wrapperCSS ? wrapperCSS : {}),
      }}
    >
      <ControlledDefaultDatePicker ref={ref} {...datePickerProps}>
        {loading ? (
          <Box
            w="full"
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Spinner my={2} />
            <Text mb={2}>Loading Month Schedule...</Text>
          </Box>
        ) : (
          <Box maxW="250px">
            <CustomAlert
              status={error ? 'error' : 'info'}
              title={
                error
                  ? 'Error Fetching Schedule'
                  : bookedDates?.length > 0
                  ? 'Red Highlight:'
                  : ''
              }
              description={
                error
                  ? error?.message || 'Unknown error!'
                  : bookedDates?.length > 0
                  ? 'Booked Dates'
                  : 'Item is not scheduled for the month!'
              }
            />
          </Box>
        )}
      </ControlledDefaultDatePicker>
    </Box>
  );
});

export const ControlledBookingDatePickerPropTypes = {
  ...ControlledDefaultDatePickerPropTypes,
  loading: PropTypes.bool,
  error: PropTypes.object,
  showFooter: PropTypes.bool,
  wrapperCSS: PropTypes.object,
  bookedDates: PropTypes.array,
};

ControlledBookingDatePicker.propTypes = {
  ...ControlledBookingDatePickerPropTypes,
};

ControlledBookingDatePicker.defaultProps = {
  showFooter: false,
};

export default ControlledBookingDatePicker;
