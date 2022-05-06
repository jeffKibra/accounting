import React from "react";
import {
  Box,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormHelperText,
  FormErrorMessage,
  Button,
  Flex,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import PropTypes from "prop-types";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  adjustment: yup
    .number()
    .typeError("Value must be a number!")
    .required("*Required!"),
});

function AdjustmentForm(props) {
  const { adjustment, handleFormSubmit, onClose } = props;

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      adjustment: adjustment || 0,
    },
  });

  function onSubmit(data) {
    console.log({ data });
    handleFormSubmit({
      ...data,
      adjustment: +data.adjustment,
    });
    reset();
    onClose && onClose();
  }

  return (
    <Box as="form" role="form" onSubmit={handleSubmit(onSubmit)}>
      <FormControl isRequired isInvalid={errors.adjustment}>
        <FormLabel htmlFor="adjustment">Adjustment</FormLabel>
        <Controller
          name="adjustment"
          control={control}
          render={({ field: { onBlur, onChange, ref, value, name } }) => {
            return (
              <NumberInput
                name={name}
                onChange={onChange}
                value={value}
                ref={ref}
                onBlur={onBlur}
                id="adjustment"
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            );
          }}
        />
        <FormErrorMessage>{errors.adjustment?.message}</FormErrorMessage>
        <FormHelperText>
          Add +ve or -ve that need to be applied to adjust the total amount
        </FormHelperText>
      </FormControl>
      <Flex mt={4}>
        {onClose && (
          <Button mr={4} onClick={onClose}>
            close
          </Button>
        )}
        <Button colorScheme="cyan" type="submit">
          ADD
        </Button>
      </Flex>
    </Box>
  );
}

AdjustmentForm.propTypes = {
  adjustment: PropTypes.number,
  handleFormSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func,
};

export default AdjustmentForm;
