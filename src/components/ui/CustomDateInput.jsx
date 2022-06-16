import React from "react";
import { Input } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

function CustomDateInput(props) {
  const { name, required } = props;
  const { register } = useFormContext();

  function convert() {
    /**
     * required input format
     * yyyy-mm-dd
     */
  }

  return (
    <Input
      id={name}
      type="date"
      {...register(name, {
        required: { value: required, message: "*Required!" },
        valueAsDate: true,
      })}
      onClick={(e) => e.target.showPicker()}
    />
  );
}

export default CustomDateInput;
