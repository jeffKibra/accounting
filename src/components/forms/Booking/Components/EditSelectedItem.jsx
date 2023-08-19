import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Heading, Text, Spinner, Flex } from '@chakra-ui/react';

//
import { useCheckItemAvailability } from '../hooks';
//
//
import Editable from './Editable';

function convertDateToString(date) {
  return date ? new Date(date).toDateString() : '';
}

function EditSelectedItem(props) {
  //   console.log({ orgId });

  const { getValues, watch } = useFormContext();

  const item = watch('item');
  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const startDateString = convertDateToString(startDate);
  const endDateString = convertDateToString(endDate);

  const { itemIsAvailable, loading, checkItemAvailability } =
    useCheckItemAvailability();

  //   console.log({ loading, itemIsAvailable });

  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const currentSelectedItem = getValues('item');
    // console.log('selected item changed', currentSelectedItem);

    setSelectedItem(prevItem => currentSelectedItem || prevItem);
  }, [item?.name, getValues]);

  useEffect(() => {
    // console.log('booking dates have changed');

    const currentSelectedItem = getValues('item');
    // console.log({ currentSelectedItem });
    const itemId = currentSelectedItem?.itemId;

    const dateRange = `${startDateString}_${endDateString}`;
    if (itemId) {
      //   checkItemAvailability(itemId, dateRange);
    }
  }, [startDateString, endDateString, getValues, checkItemAvailability]);

  //   console.log({ selectedItem });

  const carModel = item?.model || {};

  return (
    <Editable>
      {loading ? (
        <Flex direction="column" justify="center" alignItems="center">
          <Spinner size="lg" color="cyan" />
          <Text mt={3}>Checking Car Schedule...</Text>
        </Flex>
      ) : (
        <>
          <Heading mt={-4} textTransform="uppercase">
            {item?.name || ''}
          </Heading>
          <Text>{`${carModel?.make} ${carModel?.model} (${item?.year})`}</Text>
        </>
      )}
    </Editable>
  );
}

export default EditSelectedItem;
