import { useContext } from "react";
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
  // Heading,
  Container,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useFormContext, Controller } from "react-hook-form";

import StepperContext from "../../../contexts/StepperContext";

function DetailsForm(props) {
  const { loading } = props;
  const { nextStep } = useContext(StepperContext);

  const {
    register,
    formState: { errors },
    watch,
    control,
    trigger,
  } = useFormContext();
  // console.log({ details });

  async function next() {
    //trigger validation
    await trigger([
      "type",
      "companyName",
      "salutation",
      "firstName",
      "lastName",
      "displayName",
      "email",
      "phone",
      "mobile",
    ]);
    const fieldsValid = Object.keys(errors).length === 0;
    if (fieldsValid) {
      nextStep();
    }
  }

  const [salutation, firstName, lastName, companyName] = watch([
    "salutation",
    "firstName",
    "lastName",
    "companyName",
  ]);

  return (
    <Container py={6}>
      {/* <Heading size="sm" textAlign="center">
        Customer Details
      </Heading> */}
      <Grid
        columnGap={4}
        rowGap={2}
        templateColumns="repeat(12, 1fr)"
        mt={2}
        mb={1}
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
          onClick={next}
          isLoading={loading}
          variant="outline"
          colorScheme="cyan"
          type="button"
        >
          next
        </Button>
      </Flex>
    </Container>
  );
}

DetailsForm.propTypes = {
  loading: PropTypes.bool.isRequired,
};

export default DetailsForm;
