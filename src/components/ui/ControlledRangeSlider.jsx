import {
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

export default function ControlledRangeSlider(props) {
  console.log({ props });
  const { onChange, value, onBlur, isReadOnly } = props;

  function handleChange(incomingValue) {
    console.log({ incomingValue });
    onChange(incomingValue);
  }

  return (
    <RangeSlider
      aria-label="Range slider"
      min={0}
      max={300}
      defaultValue={[10, 30]}
      colorScheme="cyan"
      onChange={handleChange}
      value={value}
      isReadOnly={isReadOnly}
      onBlur={onBlur}
    >
      <RangeSliderTrack>
        <RangeSliderFilledTrack />
      </RangeSliderTrack>
      <RangeSliderThumb index={0} />
      <RangeSliderThumb index={1} />
    </RangeSlider>
  );
}

ControlledRangeSlider.defaultProps = {
  onBlur: () => {},
  isReadOnly: false,
};

ControlledRangeSlider.propTypes = {
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  value: PropTypes.array,
  isReadOnly: PropTypes.bool,
};
