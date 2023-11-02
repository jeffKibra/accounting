import { Flex } from '@chakra-ui/react';
import PropTypes from 'prop-types';
//
import RateFilters from './RateFilters';
import CustomTag from './CustomTag';

function FiltersDisplay(props) {
  const { filters, ratesRangeFacet, onChange } = props;
  const { rate, ...moreFilters } = filters;

  function updateFilters(filterGroupKey, incomingValues) {
    const incomingFilters = {
      ...filters,
      [filterGroupKey]: incomingValues,
    };

    // console.log({
    //   filterGroupKey,
    //   incomingValues,
    //   filters,
    //   incomingFilters,
    // });

    onChange(incomingFilters);
  }

  function removeFilter(filterGroupKey, deletedValue) {
    const currentValues = moreFilters[filterGroupKey];

    let incomingValues = [];

    if (Array.isArray(currentValues)) {
      incomingValues = currentValues.filter(val => val !== deletedValue);
    }

    // console.log({
    //   filterGroupKey,
    //   deletedValue,
    //   currentValues,
    //   incomingValues,
    //   filters,
    // });

    updateFilters(filterGroupKey, incomingValues);
  }

  return (
    <Flex flexWrap="wrap" direction="row" px={4} spacing={3} mb={2}>
      <RateFilters
        selectedRatesRange={rate}
        ratesRangeFacet={ratesRangeFacet}
        onChange={incomingRatesRange =>
          updateFilters('rate', incomingRatesRange)
        }
      />

      {Object.keys(moreFilters).map(filterGroupKey => {
        const values = moreFilters[filterGroupKey];

        if (!Array.isArray(values)) {
          return <></>;
        }

        return values.map((value, i) => {
          return (
            <CustomTag
              key={i}
              onClose={e => removeFilter(filterGroupKey, value, e)}
            >
              {value}
            </CustomTag>
          );
        });
      })}
    </Flex>
  );
}

FiltersDisplay.propTypes = {
  filters: PropTypes.object,
  ratesRangeFacet: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

export default FiltersDisplay;
