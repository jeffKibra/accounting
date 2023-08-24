import { Grid, GridItem } from '@chakra-ui/react';
import PropTypes from 'prop-types';
//
//
//
import StartDateSelector from './StartDateSelector';
import EndDateSelector from './EndDateSelector';
import SelectedDates from './SelectedDates';

//----------------------------------------------------------------

BookingDaysSelector.propTypes = {
  loading: PropTypes.bool,
  colSpan: PropTypes.number.isRequired,
  isEditing: PropTypes.bool,
  loadSchedules: PropTypes.bool,
  itemId: PropTypes.string,
};

BookingDaysSelector.defaultProps = {
  colSpan: 6,
};

export default function BookingDaysSelector(props) {
  const { isEditing, loading, colSpan, itemId, loadSchedules } = props;

  return (
    <>
      <Grid
        my={2}
        rowGap={2}
        columnGap={4}
        templateColumns="repeat(12, 1fr)"
        w="full"
      >
        <GridItem colSpan={colSpan}>
          <StartDateSelector
            isEditing={isEditing}
            itemId={itemId}
            loadSchedules={loadSchedules}
            loading={loading}
          />
        </GridItem>

        <GridItem colSpan={colSpan}>
          <EndDateSelector
            isEditing={isEditing}
            itemId={itemId}
            loadSchedules={loadSchedules}
            loading={loading}
          />
        </GridItem>

        <GridItem colSpan={12} mt={-3}>
          <SelectedDates />
        </GridItem>
      </Grid>
    </>
  );
}
