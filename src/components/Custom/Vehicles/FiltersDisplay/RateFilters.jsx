import PropTypes from 'prop-types';
//
import CustomTag from './CustomTag';
//
import { checkIfRangeIsValid } from './utils';

function RateFilters(props) {
  const { selectedRatesRange, ratesRangeFacet } = props;

  //
  const ratesRangeMin = ratesRangeFacet?.min;
  const ratesRangeMax = ratesRangeFacet?.max;
  const ratesRangeFacetIsValid = checkIfRangeIsValid([
    ratesRangeMin,
    ratesRangeMax,
  ]);

  const selectedRangeIsValid = checkIfRangeIsValid(selectedRatesRange);

  if (!selectedRangeIsValid || !ratesRangeFacetIsValid) {
    console.log('ranges not valid', {
      selectedRatesRange,
      ratesRangeFacetIsValid,
    });
    return null;
  }

  const selectedMin = selectedRatesRange[0];
  const selectedMax = selectedRatesRange[1];

  //
  const minNotChanged = selectedMin === ratesRangeMin;
  const maxNotChanged = selectedMax === ratesRangeMax;

  const rangeNotChanged = minNotChanged && maxNotChanged;

  if (rangeNotChanged) {
    console.log('selected range is similar to default range', {
      selectedMin,
      selectedMax,
      ratesRangeMin,
      ratesRangeMax,
    });
    return null;
  }

  return (
    <>
      {minNotChanged ? null : (
        <CustomTag>Rate Min: {Number(selectedMin).toLocaleString()}</CustomTag>
      )}
      {maxNotChanged ? null : (
        <CustomTag>Rate Max: {Number(selectedMax).toLocaleString()}</CustomTag>
      )}
    </>
  );
}

RateFilters.propTypes = {
  selectedRatesRange: PropTypes.arrayOf(PropTypes.number),
  ratesRangeFacet: PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.number,
  }),
};

export default RateFilters;
