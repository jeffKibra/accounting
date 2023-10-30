import { useFormContext, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
//
import ControlledRangeSlider, {
  RangeSliderPropTypes,
} from '../ControlledRangeSlider';

function RHFRangeSlider(props) {
  const { name, isReadOnly, ...moreProps } = props;

  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value } }) => {
        return (
          <ControlledRangeSlider
            onChangeEnd={onChange}
            onChange={onChange}
            isReadOnly={isReadOnly}
            onBlur={onBlur}
            value={value}
            {...moreProps}
          />
        );
      }}
    />
  );
}

RHFRangeSlider.propTypes = {
  ...RangeSliderPropTypes,
  name: PropTypes.string.isRequired,
  isReadOnly: PropTypes.bool,
  controllerProps: PropTypes.object,
};

export default RHFRangeSlider;
