import { Controller, useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';
//

import ControlledDatePicker from './ControlledDatePicker';

//----------------------------------------------------------------
DateRangePicker.propTypes = {
  isReadOnly: PropTypes.bool.isRequired,
  dateIntervalsToExclude: PropTypes.array,
  inline: PropTypes.bool,
};

export default function DateRangePicker(props) {
  console.log({ props });
  const { isReadOnly, name, dateIntervalsToExclude, inline, ...moreProps } =
    props;

  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value, name, ref } }) => {
        console.log('date range', value);
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
            excludeDateIntervals={
              Array.isArray(dateIntervalsToExclude)
                ? dateIntervalsToExclude
                : []
            }
            selectsRange
            selectsDisabledDaysInRange
            inline={inline}
            {...moreProps}
          />
        );
      }}
    />
  );
}
