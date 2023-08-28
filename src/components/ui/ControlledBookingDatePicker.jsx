import { forwardRef } from 'react';
import { Box, Spinner, Text } from '@chakra-ui/react';
import PropTypes from 'prop-types';

//
import ControlledDefaultDatePicker, {
  ControlledDefaultDatePickerPropTypes,
} from './ControlledDefaultDatePicker';

//----------------------------------------------------------------

const ControlledBookingDatePicker = forwardRef((props, ref) => {
  // console.log({ props });
  const { loading, showFooter, wrapperCSS, ...datePickerProps } = props;
  console.log({ datePickerProps });

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
        ) : showFooter ? (
          <Text pl={4} py={2}>
            <Text color="red">Red Highlight = </Text>
            Already Booked Dates
          </Text>
        ) : null}
      </ControlledDefaultDatePicker>
    </Box>
  );
});

export const ControlledBookingDatePickerPropTypes = {
  ...ControlledDefaultDatePickerPropTypes,
  loading: PropTypes.bool,
  showFooter: PropTypes.bool,
  wrapperCSS: PropTypes.object,
};

ControlledBookingDatePicker.propTypes = {
  ...ControlledBookingDatePickerPropTypes,
};

ControlledBookingDatePicker.defaultProps = {
  showFooter: false,
};

export default ControlledBookingDatePicker;
