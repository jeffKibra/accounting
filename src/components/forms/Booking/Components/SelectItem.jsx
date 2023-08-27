import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
} from '@chakra-ui/react';
import { useFormContext, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
//
import ItemsLoader from '../ItemsLoader';

function SelectItem(props) {
  const { onSelect, preselectedItemId, preselectedDates } = props;

  const { control, setValue, watch } = useFormContext();

  const selectedDates = watch('selectedDates');

  return (
    <Controller
      name="item"
      control={control}
      render={({ field: { onChange, value } }) => {
        function handleChange(item) {
          // console.log({ item });
          onChange(item);
          const itemRate = item?.rate || 0;

          //update rate and reset transfer rate
          setValue('bookingRate', itemRate, {
            shouldValidate: true,
            shouldDirty: true,
          });

          //call cb
          typeof onSelect === 'function' && onSelect(item);
        }

        return selectedDates?.length > 0 ? (
          <Box mx={-4}>
            <ItemsLoader
              onItemSelect={handleChange}
              selectedItem={value}
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
        );
      }}
    />
  );
}

SelectItem.propTypes = {
  onSelect: PropTypes.func,
  preselectedItemId: PropTypes.string,
  preselectedDates: PropTypes.array,
};

SelectItem.defaultProps = {
  onSelect: () => {},
  preselectedItemId: '',
  preselectedDates: [],
};

export default SelectItem;
