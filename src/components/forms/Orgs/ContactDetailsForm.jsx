import { useContext } from "react";
import {
  FormControl,
  Input,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Button,
  Flex,
  Container,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";

import StepperContext from "../../../contexts/StepperContext";

function ContactDetailsForm(props) {
  const { loading, handleFormSubmit, defaultValues } = props;
  const { nextStep, prevStep } = useContext(StepperContext);

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: defaultValues || {},
  });

  const formValues = watch();

  function prev() {
    handleFormSubmit(formValues);
    prevStep();
  }

  function next(data) {
    handleFormSubmit(data);
    nextStep();
  }

  return (
    <Container
      bg="white"
      borderRadius="md"
      shadow="md"
      p={4}
      as="form"
      role="form"
      onSubmit={handleSubmit(next)}
    >
      <Grid gap={2} templateColumns="repeat(12, 1fr)">
        <GridItem colSpan={[12, 6]}>
          <FormControl
            isDisabled={loading}
            isRequired
            isInvalid={!!errors.phone}
          >
            <FormLabel>phone</FormLabel>
            <Input
              {...register("phone", {
                required: { value: true, message: "Required!" },
              })}
            />
            <FormHelperText>Format : 254 712 345678</FormHelperText>
            <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem colSpan={[12, 6]}>
          <FormControl
            isDisabled={loading}
            isRequired
            isInvalid={!!errors.address}
          >
            <FormLabel>address</FormLabel>
            <Input
              {...register("address", {
                required: { value: true, message: "Required!" },
              })}
            />
            <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem colSpan={[12, 6]}>
          <FormControl
            isDisabled={loading}
            isRequired
            isInvalid={!!errors.city}
          >
            <FormLabel>city</FormLabel>
            <Input
              {...register("city", {
                required: { value: true, message: "Required!" },
              })}
            />
            <FormErrorMessage>{errors.city?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem colSpan={[12, 6]}>
          <FormControl isDisabled={loading} isInvalid={!!errors.website}>
            <FormLabel>website</FormLabel>
            <Input {...register("website")} />
            <FormErrorMessage>{errors.website?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
      </Grid>
      <Flex justify="space-evenly" mt={4}>
        <Button
          isLoading={loading}
          colorScheme="cyan"
          variant="outline"
          onClick={prev}
        >
          prev
        </Button>
        <Button isLoading={loading} colorScheme="cyan" type="submit">
          next
        </Button>
      </Flex>
    </Container>
  );
}

ContactDetailsForm.propTypes = {
  loading: PropTypes.bool.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  defaultValues: PropTypes.object,
};

export default ContactDetailsForm;
