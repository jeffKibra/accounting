import { useRef, forwardRef } from 'react';
import { Input } from '@chakra-ui/react';
import PropTypes from 'prop-types';

const ControlledSearchInput = forwardRef((props, ref) => {
  const {
    id,
    onSearch,
    onChange,
    onBlur,
    value,
    placeholder,
    delayBeforeSearchMS,
    ...inputProps
  } = props;

  const timeoutRef = useRef(null);

  function resetTimeout() {
    const currentTimeout = timeoutRef.current;
    // console.log({ currentTimeout });
    clearTimeout(currentTimeout);
  }

  function newTimeout(valueToSearch) {
    timeoutRef.current = setTimeout(() => {
      onSearch(valueToSearch);
    }, delayBeforeSearchMS || 1000);
  }

  function handleSearch(valueToSearch) {
    onSearch(valueToSearch);
    //reset timeoutRef
    resetTimeout();
  }

  function handleKeyPress(e) {
    // console.log('key has been pressed...', { e });
    const pressedKey = e?.key;

    if (pressedKey === 'Enter') {
      console.log('Enter key has been pressed...');
      //manually search
      handleSearch(value);
    }
  }

  function handleChange(e) {
    //reset timeout ref
    resetTimeout();

    const inValue = e?.target?.value;
    // console.log(inValue);

    onChange(inValue);

    //set new timeoutRef
    newTimeout(inValue);
  }

  return (
    <Input
      ref={ref}
      type="search"
      placeholder={placeholder || 'Search...'}
      size="sm"
      value={value || ''}
      id={id || 'search-input'}
      onChange={handleChange}
      onBlur={onBlur}
      onKeyUp={handleKeyPress}
      {...inputProps}
    />
  );
});

ControlledSearchInput.propTypes = {
  id: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onBlur: PropTypes.func,
  onSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  delayBeforeSearchMS: PropTypes.number,
};

ControlledSearchInput.defaultProps = {
  onBlur: () => {},
  onSearch: () => {},
  delayBeforeSearchMS: 1000,
};

export default ControlledSearchInput;
