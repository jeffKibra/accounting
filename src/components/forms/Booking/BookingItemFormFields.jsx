import { Grid, GridItem, Text, Heading } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';
//

import SaleSummaryTable from 'components/tables/Sales/SaleSummaryTable';
//
import Editable from './Components/Editable';
//
import { DateDisplay, NumberDisplay } from './Components/CustomDisplays';
import EditBookingPricing from './Components/EditBookingPricing';
import EditBookingDates from './Components/EditBookingDates';

function BookingItemFormFields(props) {
  const { loading } = props;

  const { watch } = useFormContext();

  const item = watch('item');
  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const bookingRate = watch('bookingRate');
  const transferAmount = watch('transferAmount');
  const selectedDates = watch('selectedDates');
  const bookingTotal = watch('bookingTotal');

  const carModel = item?.model || {};

  return (
    <>
      <Grid
        rowGap={2}
        columnGap={2}
        templateColumns="repeat(12, 1fr)"
        flexGrow={1}
      >
        <GridItem
          colSpan={12}
          mt={-4}
          mx={-4}
          p={4}
          bg="#f4f6f8"
          borderTopLeftRadius="lg"
          borderTopRightRadius="lg"
        >
          <EditBookingDates>
            {onOpen => {
              return (
                <Editable onEditToggle={onOpen}>
                  <DateDisplay title="Pick up Date" value={startDate} />
                  <DateDisplay title="Return Date" value={endDate} />
                </Editable>
              );
            }}
          </EditBookingDates>
        </GridItem>

        <GridItem colSpan={[12, 6]} mt={4}>
          <Editable>
            <Heading mt={-4} textTransform="uppercase">
              {item?.name || ''}
            </Heading>
            <Text>{`${carModel?.make} ${carModel?.model} (${item?.year})`}</Text>
          </Editable>
        </GridItem>

        <GridItem colSpan={[12, 6]} mt={-4}>
          <EditBookingPricing>
            {onOpen => {
              return (
                <Editable onEditToggle={onOpen}>
                  <NumberDisplay
                    title="Transfer Amount"
                    value={Number(transferAmount).toLocaleString()}
                  />
                  <NumberDisplay
                    title="Rate Per Day"
                    value={Number(bookingRate).toLocaleString()}
                  />
                  <NumberDisplay
                    title="Days Count"
                    value={selectedDates?.length || 0}
                  />
                  <NumberDisplay
                    title="Booking Total"
                    value={Number(bookingTotal || 0).toLocaleString()}
                  />
                </Editable>
              );
            }}
          </EditBookingPricing>
        </GridItem>

        <GridItem colSpan={[0, 4, 6]}></GridItem>
        <GridItem colSpan={[12, 8, 6]} mr={-5}>
          <SaleSummaryTable loading={loading} />
        </GridItem>
      </Grid>
    </>
  );
}

BookingItemFormFields.propTypes = {
  itemsObject: PropTypes.object.isRequired,
  selectedItemsObject: PropTypes.object.isRequired,
  updateItemFields: PropTypes.func.isRequired,
  handleItemChange: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
  field: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  taxesObject: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default BookingItemFormFields;
