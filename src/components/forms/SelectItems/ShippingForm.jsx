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
  shipping: yup
    .number()
    .typeError("Value must be a number!")
    .positive("Value must be a positive number!")
    .min(0, "Value should not be less than zero(0)")
    .required("*Required!"),
});

function ShippingForm(props) {
  const { shipping, handleFormSubmit, onClose } = props;

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      shipping: shipping || 0,
    },
  });

  function onSubmit(data) {
    console.log({ data });
    handleFormSubmit({
      ...data,
      shipping: +data.shipping,
    });
    reset();
    onClose && onClose();
  }

  return (
    <Box as="form" role="form" onSubmit={handleSubmit(onSubmit)}>
      <FormControl isRequired isInvalid={errors.shipping}>
        <FormLabel htmlFor="shipping">Shipping Charge</FormLabel>
        <Controller
          name="shipping"
          control={control}
          render={({ field: { onBlur, onChange, ref, value, name } }) => {
            return (
              <NumberInput
                name={name}
                onChange={onChange}
                value={value}
                ref={ref}
                onBlur={onBlur}
                id="shipping"
                min={0}
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
        <FormErrorMessage>{errors.shipping?.message}</FormErrorMessage>
        <FormHelperText>Amount spent on shipping the goods </FormHelperText>
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

ShippingForm.propTypes = {
  shipping: PropTypes.number,
  handleFormSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func,
};

export default ShippingForm;
