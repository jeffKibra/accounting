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

function ContactPersonForm(props) {
  const { loading, handleFormSubmit, updateFormValues, defaultValues } = props;
  const { prevStep } = useContext(StepperContext);

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

  function goBack() {
    updateFormValues(formValues);
    prevStep();
  }

  function saveOrgData(data) {
    // console.log({ data });

    // console.log("completed");
    handleFormSubmit(data);
  }

  // console.log({ activeStep, ln: steps.length });

  return (
    <Container
      bg="white"
      borderRadius="md"
      shadow="md"
      p={4}
      as="form"
      role="form"
      onSubmit={handleSubmit(saveOrgData)}
    >
      <Grid gap={2} templateColumns="repeat(12, 1fr)">
        <GridItem colSpan={[12, 6]}>
          <FormControl
            isDisabled={loading}
            isRequired
            isInvalid={!!errors.firstName}
          >
            <FormLabel>First Name</FormLabel>
            <Input
              {...register("firstName", {
                required: { value: true, message: "Required!" },
              })}
            />
            <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem colSpan={[12, 6]}>
          <FormControl
            isDisabled={loading}
            isRequired
            isInvalid={!!errors.lastName}
          >
            <FormLabel>Last Name</FormLabel>
            <Input
              {...register("lastName", {
                required: { value: true, message: "Required!" },
              })}
            />
            <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem colSpan={[12, 6]}>
          <FormControl
            isDisabled={loading}
            isRequired
            isInvalid={!!errors.contactPhone}
          >
            <FormLabel>Phone</FormLabel>
            <Input
              {...register("contactPhone", {
                required: { value: true, message: "Required!" },
              })}
            />
            <FormHelperText>Format: 254 789 789456</FormHelperText>
            <FormErrorMessage>{errors.contactPhone?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
      </Grid>
      <Flex justify="space-evenly" mt={4}>
        <Button
          isLoading={loading}
          colorScheme="cyan"
          variant="outline"
          onClick={goBack}
        >
          prev
        </Button>
        <Button isLoading={loading} colorScheme="cyan" type="submit">
          finish
        </Button>
      </Flex>
    </Container>
  );
}

ContactPersonForm.propTypes = {
  loading: PropTypes.bool.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  defaultValues: PropTypes.object,
  updateFormValues: PropTypes.func.isRequired,
};

export default ContactPersonForm;
