import { useEffect, useContext } from "react";
import {
  FormControl,
  Input,
  Select,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  RadioGroup,
  Radio,
  Grid,
  GridItem,
  Stack,
  Text,
  Divider,
  Flex,
  Button,
  Box,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";

import StepperContext from "../../../contexts/StepperContext";

function DetailsForm(props) {
  const { loading, defaultValues, handleFormSubmit } = props;
  const { nextStep } = useContext(StepperContext);

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    reset,
    control,
  } = useForm({
    mode: "onChange",
    defaultValues: defaultValues || {},
  });
  // console.log({ details });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [reset, defaultValues]);

  function onSubmit(data) {
    handleFormSubmit(data);
    nextStep();
  }

  const [firstName, lastName, companyName] = watch([
    "firstName",
    "lastName",
    "companyName",
  ]);

  return (
    <Box
      p={4}
      bg="white"
      borderRadius="md"
      shadow="md"
      w={["full", "90%", "80%"]}
      as="form"
      role="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Grid
        columnGap={4}
        rowGap={2}
        templateColumns="repeat(12, 1fr)"
        mt="4px"
        mb="4px"
      >
        <GridItem colSpan={[12, 6]}>
          <FormControl
            isDisabled={loading}
            w="full"
            isRequired
            isInvalid={errors.type}
          >
            <FormLabel htmlFor="type">Customer Type</FormLabel>
            <Controller
              control={control}
              name="type"
              defaultValue="individual"
              render={({ field: { name, onChange, value, ref, onBlur } }) => {
                // console.log({ value });
                return (
                  <RadioGroup
                    id="type"
                    name={name}
                    ref={ref}
                    onChange={onChange}
                    value={value}
                    onBlur={onBlur}
                    // defaultValue="individual"
                  >
                    <Stack spacing={2} direction="row">
                      <Radio value="business">Business</Radio>
                      <Radio value="individual">Individual</Radio>
                    </Stack>
                  </RadioGroup>
                );
              }}
            />

            <FormErrorMessage>{errors?.type?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={[12, 6]}>
          <FormControl isDisabled={loading} isInvalid={!!errors.companyName}>
            <FormLabel htmlFor="companyName">Company Name</FormLabel>
            <Input id="companyName" {...register("companyName")} />
            <FormHelperText>Company | Business Name</FormHelperText>
            <FormErrorMessage>{errors.companyName?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem colSpan={12}>
          <Text color="#718096">Primary Contact Details</Text>
          <Divider />
        </GridItem>

        <GridItem colSpan={[12, 6]}>
          <FormControl
            isDisabled={loading}
            isRequired
            isInvalid={!!errors.firstName}
          >
            <FormLabel htmlFor="firstName">First Name</FormLabel>
            <Input
              id="firstName"
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
            <FormLabel htmlFor="lastName">Last Name</FormLabel>
            <Input
              id="lastName"
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
            isInvalid={!!errors.displayName}
          >
            <FormLabel>Customer Display Name</FormLabel>
            <Select
              placeholder="---select display name---"
              {...register("displayName", {
                required: { value: true, message: "Required!" },
              })}
            >
              <option
                value={`${firstName} ${lastName}`}
              >{`${firstName} ${lastName}`}</option>
              <option
                value={`${lastName} ${firstName}`}
              >{`${lastName} ${firstName}`}</option>
              <option value={companyName}>{companyName}</option>
            </Select>
            <FormHelperText>Name used in all transactions</FormHelperText>
            <FormErrorMessage>{errors.displayName?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={[12, 6]}>
          <FormControl isDisabled={loading} isInvalid={!!errors.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input id="email" {...register("email")} />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem colSpan={[12, 6]}>
          <FormControl
            isDisabled={loading}
            isRequired
            isInvalid={!!errors.workPhone}
          >
            <FormLabel htmlFor="workPhone">Work Phone</FormLabel>
            <Input
              id="workPhone"
              {...register("workPhone", {
                required: { value: true, message: "*Required!" },
              })}
            />
            <FormErrorMessage>{errors.workPhone?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem colSpan={[12, 6]}>
          <FormControl isDisabled={loading} isInvalid={!!errors.mobile}>
            <FormLabel htmlFor="mobile">mobile</FormLabel>
            <Input id="mobile" {...register("mobile")} />
            <FormErrorMessage>{errors.mobile?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
      </Grid>
      <Flex justifyContent="space-around" mt={4}>
        <Button
          isLoading={loading}
          variant="outline"
          colorScheme="cyan"
          type="submit"
        >
          next
        </Button>
      </Flex>
    </Box>
  );
}

DetailsForm.propTypes = {
  loading: PropTypes.bool.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  defaultValues: PropTypes.shape({
    type: PropTypes.string,
    companyName: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    displayName: PropTypes.string,
    email: PropTypes.string,
    workPhone: PropTypes.string,
    mobile: PropTypes.string,
  }),
};

export default DetailsForm;
