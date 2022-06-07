import { useContext } from "react";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  FormHelperText,
  FormErrorMessage,
  Button,
  VStack,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useForm, FormProvider } from "react-hook-form";

import InvoicesContext from "../../../contexts/InvoicesContext";
import StepperContext from "../../../contexts/StepperContext";

import CustomSelect from "../../ui/CustomSelect";
import CustomDatePicker from "../../ui/CustomDatePicker";

function InvoiceDetailsForm() {
  const { formValues, updateFormValues, customers, loading } =
    useContext(InvoicesContext);
  const { nextStep } = useContext(StepperContext);
  const today = new Date();

  const formMethods = useForm({
    mode: "onChange",
    defaultValues: formValues || {
      invoiceDate: today,
      dueDate: today,
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = formMethods;

  function onSubmit(data) {
    const { customerId } = data;

    const customer = customers.find(
      (customer) => customer.customerId === customerId
    );

    const newData = {
      ...data,
      customer,
    };
    // console.log({ newData });
    updateFormValues(newData);
    nextStep();
  }

  return (
    <VStack w="full" h="full">
      <FormProvider {...formMethods}>
        <Box
          w={["full", "80%"]}
          mt={2}
          p={4}
          bg="white"
          borderRadius="md"
          shadow="md"
          as="form"
          role="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Grid gap={4} templateColumns="repeat(12, 1fr)">
            <GridItem colSpan={[12, 6]}>
              <FormControl
                isDisabled={loading}
                isRequired
                isInvalid={errors.customerId}
              >
                <FormLabel htmlFor="customerId">Customer</FormLabel>
                <CustomSelect
                  name="customerId"
                  placeholder="--select customer--"
                  rules={{ required: { value: true, message: "*Required!" } }}
                  options={customers.map((customer) => {
                    const { customerId, displayName } = customer;

                    return { name: displayName, value: customerId };
                  })}
                />
                <FormErrorMessage>{errors.customer?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[12, 6]}>
              <FormControl isDisabled={loading} isInvalid={errors.orderNumber}>
                <FormLabel htmlFor="orderNumber">Order Number</FormLabel>
                <Input id="orderNumber" {...register("orderNumber")} />
              </FormControl>
            </GridItem>

            <GridItem colSpan={[12, 6]}>
              <FormControl
                isDisabled={loading}
                isRequired
                isInvalid={errors.invoiceDate}
              >
                <FormLabel htmlFor="invoiceDate">Invoice Date</FormLabel>
                <CustomDatePicker name="invoiceDate" required />
                {/* <Input
                  id="invoiceDate"
                  type="date"
                  {...register("invoiceDate", {
                    required: { value: true, message: "*Required!" },
                    valueAsDate: true,
                  })}
                  onClick={(e) => e.target.showPicker()}
                /> */}
                <FormErrorMessage>
                  {errors.invoiceDate?.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[12, 6]}>
              <FormControl
                isDisabled={loading}
                isRequired
                isInvalid={errors.dueDate}
              >
                <FormLabel htmlFor="dueDate">Due Date</FormLabel>
                <CustomDatePicker name="dueDate" required />
                {/* <Input
                  id="dueDate"
                  type="date"
                  {...register("dueDate", {
                    required: { value: true, message: "*Required!" },
                    // valueAsDate: true,
                  })}
                  onClick={(e) => e.target.showPicker()}
                /> */}
                <FormErrorMessage>{errors.dueDate?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[12, 6]}>
              <FormControl isDisabled={loading} isInvalid={errors.subject}>
                <FormLabel htmlFor="subject">Subject</FormLabel>
                <Input {...register("subject")} />
                <FormErrorMessage>{errors.subject?.message}</FormErrorMessage>
                <FormHelperText>
                  Let your customer know what this invoice is for
                </FormHelperText>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[12, 6]}>
              <FormControl
                isDisabled={loading}
                isInvalid={errors.customerNotes}
              >
                <FormLabel htmlFor="customerNotes">Customer Notes</FormLabel>
                <Textarea id="customerNotes" {...register("customerNotes")} />
                <FormErrorMessage>
                  {errors.customerNotes?.message}
                </FormErrorMessage>
                <FormHelperText>
                  Include a note for the customer.
                </FormHelperText>
              </FormControl>
            </GridItem>
          </Grid>

          <Flex justify="space-evenly" mt={4}>
            <Button isLoading={loading} colorScheme="cyan" type="submit">
              next
            </Button>
          </Flex>
        </Box>
      </FormProvider>
    </VStack>
  );
}

export default InvoiceDetailsForm;
