import { Flex } from '@chakra-ui/react';
import PropTypes from 'prop-types';
//
import RateFilters from './RateFilters';
import CustomTag from './CustomTag';

function FiltersDisplay(props) {
  const { filters, ratesRangeFacet } = props;
  const { rate, ...moreFilters } = filters;

  return (
    <Flex flexWrap="wrap" direction="row" px={4} spacing={3} mb={2}>
      <RateFilters
        selectedRatesRange={rate}
        ratesRangeFacet={ratesRangeFacet}
      />

      {Object.keys(moreFilters).map(filterGroupKey => {
        const values = moreFilters[filterGroupKey];

        if (!Array.isArray(values)) {
          return <></>;
        }

        return values.map(value => {
          return <CustomTag>{value}</CustomTag>;
        });
      })}
    </Flex>
  );
}

FiltersDisplay.propTypes = {
  filters: PropTypes.object,
  ratesRangeFacet: PropTypes.arrayOf(PropTypes.number),
};

export default FiltersDisplay;
