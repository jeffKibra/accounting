import { useState } from "react";
import PropTypes from "prop-types";
import {
  InputGroup,
  Input,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";

function PasswordInput(props) {
  const [visible, setVisibility] = useState(false);
  console.log({ props });
  const { register } = props;

  function changeVisibility() {
    setVisibility((prev) => !prev);
  }

  return (
    <InputGroup>
      <Input {...register()} type={visible ? "text" : "password"} pr="40px" />
      <InputRightElement>
        <IconButton
          onClick={changeVisibility}
          icon={visible ? <RiEyeOffLine /> : <RiEyeLine />}
        />
      </InputRightElement>
    </InputGroup>
  );
}

PasswordInput.propTypes = {
  register: PropTypes.func.isRequired,
};

export default PasswordInput;
