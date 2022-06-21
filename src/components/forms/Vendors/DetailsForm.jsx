import { useEffect, useContext, useMemo } from "react";
import {
  FormControl,
  Input,
  Select,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Grid,
  GridItem,
  Flex,
  Button,
  Heading,
  Container,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

import StepperContext from "../../../contexts/StepperContext";

function DetailsForm(props) {
  const { loading, defaultValues, handleFormSubmit } = props;
  const { nextStep } = useContext(StepperContext);

  const defaults = useMemo(() => {
    return {
      companyName: defaultValues?.companyName || "",
      salutation: defaultValues?.salutation || "",
      firstName: defaultValues?.firstName || "",
      lastName: defaultValues?.lastName || "",
      displayName: defaultValues?.displayName || "",
      email: defaultValues?.email || "",
      phone: defaultValues?.phone || "",
      mobile: defaultValues?.mobile || "",
    };
  }, [defaultValues]);

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: { ...defaults },
  });
  // console.log({ details });

  useEffect(() => {
    if (defaults) {
      reset(defaults);
    }
  }, [reset, defaults]);

  function onSubmit(data) {
    handleFormSubmit(data);
    nextStep();
  }

  const [salutation, firstName, lastName, companyName] = watch([
    "salutation",
    "firstName",
    "lastName",
    "companyName",
  ]);

  return (
    <Container
      maxW="container.sm"
      p={4}
      bg="white"
      borderRadius="md"
      shadow="md"
    >
      <Heading size="sm" textAlign="center">
        Vendor Details
      </Heading>
      <Container py={6} as="form" role="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid
          columnGap={4}
          rowGap={2}
          templateColumns="repeat(12, 1fr)"
          mt="4px"
          mb="4px"
        >
          <GridItem colSpan={[12, 4]}>
            <FormControl isDisabled={loading} isInvalid={!!errors.salutation}>
              <FormLabel>Salutation</FormLabel>
              <Select placeholder="salutation" {...register("salutation")}>
                <option value="Mr.">Mr.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Ms.">Ms.</option>
                <option value="Miss.">Miss.</option>
                <option value="Dr.">Dr.</option>
              </Select>
              <FormErrorMessage>{errors.salutation?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem colSpan={[12, 4]}>
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
          <GridItem colSpan={[12, 4]}>
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
            <FormControl isDisabled={loading} isInvalid={!!errors.companyName}>
              <FormLabel htmlFor="companyName">Company Name</FormLabel>
              <Input id="companyName" {...register("companyName")} />
              <FormHelperText>Company | Business Name</FormHelperText>
              <FormErrorMessage>{errors.companyName?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem colSpan={[12, 6]}>
            <FormControl
              isDisabled={loading}
              isRequired
              isInvalid={!!errors.displayName}
            >
              <FormLabel>Vendor Display Name</FormLabel>
              <Select
                placeholder="---select display name---"
                {...register("displayName", {
                  required: { value: true, message: "Required!" },
                })}
              >
                <option
                  value={`${salutation} ${firstName} ${lastName}`}
                >{`${salutation} ${firstName} ${lastName}`}</option>
                <option
                  value={`${salutation} ${lastName} ${firstName}`}
                >{`${salutation} ${lastName} ${firstName}`}</option>
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
              isInvalid={!!errors.phone}
            >
              <FormLabel htmlFor="phone">Phone</FormLabel>
              <Input
                id="phone"
                {...register("phone", {
                  required: { value: true, message: "*Required!" },
                })}
              />
              <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
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
      </Container>
    </Container>
  );
}

DetailsForm.propTypes = {
  loading: PropTypes.bool.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  defaultValues: PropTypes.shape({
    type: PropTypes.string,
    companyName: PropTypes.string,
    salutation: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    displayName: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    mobile: PropTypes.string,
  }),
};

export default DetailsForm;
