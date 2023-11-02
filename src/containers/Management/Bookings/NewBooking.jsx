import { Box } from '@chakra-ui/react';

//

import BookingForm from 'components/forms/Booking';

function NewBooking(props) {
  // const currentParams = getSearchParams(searchParams) || {};
  // console.log({ currentParams });
  // const { startDate, endDate, itemId } = currentParams;

  return (
    <Box w="full" rowGap={4}>
      <BookingForm />
    </Box>
  );
}

export default NewBooking;
