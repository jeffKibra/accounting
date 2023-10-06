import { useState } from 'react';
import {
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Box,
  Text,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

export default function ControlledRangeSlider(props) {
  // console.log({ props });
  const {
    onChangeEnd,
    onChange,
    value,
    defaultValue,
    onBlur,
    isReadOnly,
    ...moreProps
  } = props;

  const [range, setRange] = useState(defaultValue || value || []);

  function handleChange(incomingValue) {
    // console.log('handle change', { incomingValue });
    // onChange(incomingValue);
    setRange(incomingValue);
    //
    typeof onChange === 'function' && onChange(incomingValue);
  }

  function handleChangeEnd(incomingValue) {
    // console.log('handle change end', { incomingValue });
    typeof onChangeEnd === 'function' && onChangeEnd(incomingValue);
  }

  const selectedMin = range[0] || 0;
  const selectedMax = range[1] || 1;

  return (
    <Box>
      <Box w="full">
        <Text fontSize="sm">{`KES ${Number(
          selectedMin
        ).toLocaleString()} - KES ${Number(
          selectedMax
        ).toLocaleString()}`}</Text>
      </Box>

      <RangeSlider
        aria-label="Range slider"
        // defaultValue={[10, 30]}
        colorScheme="cyan"
        onChange={handleChange}
        onChangeEnd={handleChangeEnd}
        value={value}
        isReadOnly={isReadOnly}
        onBlur={onBlur}
        {...moreProps}
      >
        <RangeSliderTrack>
          <RangeSliderFilledTrack />
        </RangeSliderTrack>
        <RangeSliderThumb index={0} />
        <RangeSliderThumb index={1} />
      </RangeSlider>
    </Box>
  );
}

ControlledRangeSlider.defaultProps = {
  onBlur: () => {},
  onChange: () => {},
  isReadOnly: false,
};

export const RangeSliderPropTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  icon: PropTypes.node,
};

ControlledRangeSlider.propTypes = {
  ...RangeSliderPropTypes,
  onChange: PropTypes.func,
  onChangeEnd: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  value: PropTypes.array.isRequired,
  defaultValue: PropTypes.array,
  isReadOnly: PropTypes.bool,
};
