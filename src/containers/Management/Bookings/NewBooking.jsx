import { useMemo } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useSearchParams } from 'react-router-dom';
//
import { getSearchParams } from 'utils/general';
//
import BookingDaysSelectorForm from 'components/forms/Booking/BookingDaysSelectorForm';
import ItemsLoader from 'components/forms/Booking/ItemsLoader';

function NewBooking(props) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentParams = getSearchParams(searchParams) || {};
  console.log({ currentParams });

  const stage = useMemo(() => {
    let tempStage = 0;

    const currentParams = getSearchParams(searchParams);
    console.log({ currentParams });
    const { startDate, endDate, itemId } = currentParams;

    if (startDate && endDate) {
      if (itemId) {
        tempStage = 2;
      } else {
        tempStage = 1;
      }
    } else {
      tempStage = 0;
    }

    return tempStage;
  }, [searchParams]);

  console.log({ stage });

  return (
    <Box w="full">
      {stage === 0 ? (
        <BookingDaysSelectorForm />
      ) : stage === 1 ? (
        <ItemsLoader />
      ) : stage === 2 ? (
        <Box></Box>
      ) : (
        <Box></Box>
      )}
    </Box>
  );
}

export default NewBooking;
