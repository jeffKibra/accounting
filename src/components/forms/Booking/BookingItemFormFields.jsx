import { Grid, GridItem } from '@chakra-ui/react';
import PropTypes from 'prop-types';
//

import SaleSummaryTable from 'components/tables/Sales/SaleSummaryTable';
//
import EditBookingPricing from './Components/EditBookingPricing';
import EditBookingDates from './Components/EditBookingDates';
import EditSelectedItem from './Components/EditSelectedItem';

function BookingItemFormFields(props) {
  const { loading } = props;

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
          <EditBookingDates loading={loading} />
        </GridItem>

        <GridItem colSpan={[12, 6]} mt={4}>
          <EditSelectedItem loading={loading} />
        </GridItem>

        <GridItem colSpan={[12, 6]} mt={-4}>
          <EditBookingPricing loading={loading} />
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
