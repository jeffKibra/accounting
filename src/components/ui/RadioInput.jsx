import { Radio, RadioGroup, Wrap, WrapItem } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";
import PropTypes from "prop-types";

function RadioInput(props) {
  const { name, options, defaultValue } = props;
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue || ""}
      render={({ field: { name, onChange, value, ref, onBlur } }) => {
        // console.log({ value });
        return (
          <RadioGroup
            id={name}
            name={name}
            ref={ref}
            onChange={onChange}
            value={value}
            onBlur={onBlur}
            // defaultValue="individual"
          >
            <Wrap spacing={2}>
              {options.map((option, i) => {
                return (
                  <WrapItem key={i}>
                    <Radio textTransform="capitalize" value={option}>
                      {option}
                    </Radio>
                  </WrapItem>
                );
              })}
            </Wrap>
          </RadioGroup>
        );
      }}
    />
  );
}

RadioInput.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  defaultValue: PropTypes.string,
};

export default RadioInput;
