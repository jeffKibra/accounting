import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  InputGroup,
  Input,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri';

function PasswordInput(props) {
  const [visible, setVisibility] = useState(false);
  const { register, size } = props;

  function changeVisibility() {
    setVisibility(prev => !prev);
  }

  return (
    <InputGroup size={size}>
      <Input {...register()} type={visible ? 'text' : 'password'} pr="40px" />
      <InputRightElement>
        <IconButton
          size={size}
          onClick={changeVisibility}
          icon={visible ? <RiEyeOffLine /> : <RiEyeLine />}
        />
      </InputRightElement>
    </InputGroup>
  );
}

PasswordInput.propTypes = {
  size: 'lg',
};

PasswordInput.propTypes = {
  register: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
};

export default PasswordInput;
