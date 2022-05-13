import { useContext } from "react";
import {
  FormControl,
  Input,
  Select,
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

function OrgDetailsForm(props) {
  const { loading, handleFormSubmit, defaultValues, isAdmin } = props;
  const { nextStep } = useContext(StepperContext);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: "onChange",
    defaultValues: defaultValues || {},
  });

  function next(data) {
    handleFormSubmit(data);
    nextStep();
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
      onSubmit={handleSubmit(next)}
    >
      <Grid gap={2} templateColumns="repeat(12, 1fr)">
        {isAdmin && (
          <GridItem colSpan={[12, 6]}>
            <FormControl
              isDisabled={loading}
              isRequired
              isInvalid={!!errors.organizaionName}
            >
              <FormLabel>Status</FormLabel>
              <Select
                {...register("status", {
                  required: { value: true, message: "Required!" },
                })}
              >
                <option value="">--select status--</option>
                <option value="onboarding">Onboarding</option>
                <option value="active">Active</option>{" "}
                <option value="suspended">Suspended</option>
              </Select>
              <FormErrorMessage>{errors.status?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
        )}

        <GridItem colSpan={[12, 6]}>
          <FormControl
            isDisabled={loading}
            isRequired
            isInvalid={!!errors.name}
          >
            <FormLabel>Company Name</FormLabel>
            <Input
              {...register("name", {
                required: { value: true, message: "Required!" },
              })}
            />
            <FormHelperText>Company | Business Name</FormHelperText>
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem colSpan={[12, 6]}>
          <FormControl
            isDisabled={loading}
            isRequired
            isInvalid={!!errors.industry}
          >
            <FormLabel>Industry</FormLabel>
            <Input
              {...register("industry", {
                required: { value: true, message: "Required!" },
              })}
            />
            <FormErrorMessage>{errors.industry?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem colSpan={[12, 6]}>
          <FormControl
            isDisabled={loading}
            isRequired
            isInvalid={!!errors.size}
          >
            <FormLabel>Size</FormLabel>
            <Select
              {...register("size", {
                required: { value: true, message: "Required!" },
              })}
            >
              <option value="">--select size--</option>
              <option value="individual">Individual (1)</option>
              <option value="micro">Micro (2-10)</option>
              <option value="small">Small (11-50)</option>{" "}
              <option value="medium">Medium (51-250)</option>
              <option value="large">Large (251+)</option>
            </Select>
            <FormHelperText>Based on number of employees|users</FormHelperText>
            <FormErrorMessage>{errors.status?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
      </Grid>
      <Flex mt={4} justify="center">
        <Button isLoading={loading} colorScheme="cyan" type="submit">
          next
        </Button>
      </Flex>
    </Container>
  );
}

OrgDetailsForm.propTypes = {
  loading: PropTypes.bool.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  defaultValues: PropTypes.object,
};

export default OrgDetailsForm;
