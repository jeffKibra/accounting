import { Controller, useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';
//

import ControlledDatePicker from './ControlledDatePicker';

//----------------------------------------------------------------
DateRangePicker.propTypes = {
  isReadOnly: PropTypes.bool.isRequired,
  datesToExclude: PropTypes.array,
  inline: PropTypes.bool,
};

export default function DateRangePicker(props) {
  console.log({ props });
  const { isReadOnly, name, datesToExclude, inline } = props;

  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value, name, ref } }) => {
        const startDate = value[0];
        const endDate = value[1];

        function handleChange(dateRange) {
          console.log({ dateRange });
          onChange(dateRange);
        }

        return (
          <ControlledDatePicker
            name={name}
            isReadOnly={isReadOnly}
            size="md"
            ref={ref}
            onBlur={onBlur}
            selected={startDate}
            onChange={handleChange}
            //date range props
            startDate={startDate}
            endDate={endDate}
            excludeDates={Array.isArray(datesToExclude) ? datesToExclude : []}
            selectsRange
            selectsDisabledDaysInRange
            inline={inline}
          />
        );
      }}
    />
  );
}
