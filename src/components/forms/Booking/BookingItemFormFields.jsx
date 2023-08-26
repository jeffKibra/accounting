import { Grid, GridItem, Box } from '@chakra-ui/react';
import PropTypes from 'prop-types';
//

import SaleSummaryTable from 'components/tables/Sales/SaleSummaryTable';
//
import EditBookingPricing from './Components/EditBookingPricing';
import EditBookingDates from './Components/EditBookingDates';
import EditSelectedItem from './Components/EditSelectedItem';

function BookingItemFormFields(props) {
  const { loading, currentBookingDetails } = props;
  console.log({ currentBookingDetails });

  return (
    <>
      <Grid
        rowGap={2}
        columnGap={4}
        templateColumns="repeat(12, 1fr)"
        flexGrow={1}
      >
        {/* <GridItem
          colSpan={12}
          mt={-4}
          mx={-4}
          p={4}
          bg="#f4f6f8"
          borderTopLeftRadius="lg"
          borderTopRightRadius="lg"
        >
          <EditBookingDates loading={loading} />
        </GridItem> */}

        <GridItem colSpan={[12, 6]} mt={4}>
          <EditSelectedItem loading={loading} />

          <Box w="full" py={4}>
            <EditBookingDates
              loading={loading}
              currentBookingDetails={currentBookingDetails}
            />
          </Box>
        </GridItem>

        <GridItem colSpan={[12, 6]} mt={-4}>
          <EditBookingPricing loading={loading} />
          <SaleSummaryTable loading={loading} />
        </GridItem>

        {/* <GridItem colSpan={[0, 4, 6]}></GridItem>
        <GridItem colSpan={[12, 8, 6]} mr={-5}></GridItem> */}
      </Grid>
    </>
  );
}

BookingItemFormFields.propTypes = {
  // itemsObject: PropTypes.object,
  // selectedItemsObject: PropTypes.object.isRequired,
  // updateItemFields: PropTypes.func.isRequired,
  // handleItemChange: PropTypes.func.isRequired,
  // removeItem: PropTypes.func.isRequired,
  // field: PropTypes.object.isRequired,
  // index: PropTypes.number.isRequired,
  taxesObject: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  currentBookingDetails: PropTypes.object,
};

export default BookingItemFormFields;
