import { useState, forwardRef } from 'react';
import { Input, InputGroup, InputLeftAddon } from '@chakra-ui/react';
import { RiSearchLine } from 'react-icons/ri';
import PropTypes from 'prop-types';

//-------------------------------------------------------------------
SearchOnTypeInput.propTypes = {
  delay: PropTypes.number.isRequired,
  onSearch: PropTypes.func.isRequired,
};

SearchOnTypeInput.defaultProps = {
  delay: 1000,
};

function SearchOnTypeInput(props, ref) {
  const { delay, onSearch } = props;
  const [timer, setTimer] = useState(null);

  function handleKeyUp(e) {
    const value = e.target.value;

    if (timer) {
      clearTimeout(timer);
    }

    const newTimer = setTimeout(() => onSearch(value), delay);
    setTimer(newTimer);
  }

  return (
    <InputGroup>
      <InputLeftAddon>
        <RiSearchLine />
      </InputLeftAddon>
      <Input {...(ref ? { ref } : {})} onKeyUp={handleKeyUp} />
    </InputGroup>
  );
}

export default forwardRef(SearchOnTypeInput);
