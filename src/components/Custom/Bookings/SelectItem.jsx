import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
//
import { SearchItemsContextProvider } from 'contexts/SearchItemsContext';

//
import ItemsLoader from 'components/forms/Booking/ItemsLoader';

function SelectItem(props) {
  const {
    onSelect,
    preselectedItemId,
    preselectedDates,
    watch,
    setValue,
    bookingId,
  } = props;

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const selectedDates = watch('selectedDates');
  const queryVariables = watch('queryVariables');
  const item = watch('item');
  console.log({ selectedDates, queryVariables });

  const handleItemSelect = useCallback(
    (item, incomingQueryVariables) => {
      console.log('handling item selection in form', {
        item,
        incomingQueryVariables,
      });
      // console.log({ item });
      const itemRate = item?.rate || 0;

      setValue('item', item);
      setValue('queryVariables', incomingQueryVariables);
      //update rate and reset transfer rate
      setValue('bookingRate', itemRate, {
        shouldValidate: true,
        shouldDirty: true,
      });
      //call passed cb
      typeof onSelect === 'function' && onSelect(item);
      //
      navigate(`${pathname}?stage=2`);
    },
    [setValue, pathname, navigate, onSelect]
  );

  //----------------------------------------------------------------

  return (
    <SearchItemsContextProvider
      selectedDatesString={selectedDates}
      defaultValues={queryVariables}
      bookingId={bookingId}
    >
      {selectedDates?.length > 0 ? (
        <Box mx={-4}>
          <ItemsLoader
            onItemSelect={handleItemSelect}
            selectedItem={item}
            selectedDates={selectedDates}
            preselectedItemId={preselectedItemId}
            preselectedDates={preselectedDates}
          />
        </Box>
      ) : (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Date Range Error!</AlertTitle>
          <AlertDescription>
            Select a Valid Date Range to continue... End Date must be the same
            or ahead of Start Date
          </AlertDescription>
        </Alert>
      )}
    </SearchItemsContextProvider>
  );
}

SelectItem.propTypes = {
  onSelect: PropTypes.func.isRequired,
  preselectedItemId: PropTypes.string,
  preselectedDates: PropTypes.array,
  watch: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  bookingId: PropTypes.string,
};

SelectItem.defaultProps = {
  onSelect: () => {},
  preselectedItemId: '',
  preselectedDates: [],
};

export default SelectItem;
