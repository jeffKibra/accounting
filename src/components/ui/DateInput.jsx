import { forwardRef } from 'react';
import { Input } from '@chakra-ui/react';
import PropTypes from 'prop-types';

import 'react-datepicker/dist/react-datepicker.css';

//----------------------------------------------------------------

const DateInput = forwardRef((props, ref) => {
  // console.log({ props, ref });
  const { onClick, onChange, value, ...extraProps } = props;
  //   console.log({ value, extraProps });

  return (
    <Input
      {...extraProps}
      onClick={onClick}
      onChange={onChange}
      value={value}
      ref={ref}
    />
  );
});

DateInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  value: PropTypes.any,
};

DateInput.defaultProps = {
  onChange: () => {
    console.log('default onChange fn!');
  },
  onClick: () => {
    console.log('default onClick fn!');
  },
};

export default DateInput;
