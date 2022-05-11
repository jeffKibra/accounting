import { useContext } from "react";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  FormHelperText,
  FormErrorMessage,
  Button,
  VStack,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import InvoicesContext from "../../../contexts/InvoicesContext";
import StepperContext from "../../../contexts/StepperContext";

function InvoiceDetailsForm() {
  const { formValues, updateFormValues, customers, loading, finish } =
    useContext(InvoicesContext);
  const { prevStep } = useContext(StepperContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: formValues || {},
  });

  const values = watch();
  function goBack() {
    updateFormValues(values);
    prevStep();
  }

  function onSubmit(data) {
    const { customerId } = data;

    const customer = customers.find(
      (customer) => customer.customerId === customerId
    );

    const newData = {
      ...data,
      customer,
    };

    finish(newData);
  }

  return (
    <VStack w="full" h="full">
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
              <Select
                id="customerId"
                {...register("customerId", {
                  required: { value: true, message: "*Required" },
                })}
                placeholder="---select customer---"
              >
                {customers.map((customer, i) => {
                  const { displayName, customerId } = customer;
                  return (
                    <option value={customerId} key={i}>
                      {displayName}
                    </option>
                  );
                })}
              </Select>
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
              <Input
                id="invoiceDate"
                type="date"
                {...register("invoiceDate", {
                  required: { value: true, message: "*Required!" },
                })}
              />
              <FormErrorMessage>{errors.invoiceDate?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem colSpan={[12, 6]}>
            <FormControl
              isDisabled={loading}
              isRequired
              isInvalid={errors.dueDate}
            >
              <FormLabel htmlFor="dueDate">Due Date</FormLabel>
              <Input
                id="dueDate"
                type="date"
                {...register("dueDate", {
                  required: { value: true, message: "*Required!" },
                })}
              />
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
            <FormControl isDisabled={loading} isInvalid={errors.customerNotes}>
              <FormLabel htmlFor="customerNotes">Customer Notes</FormLabel>
              <Textarea id="customerNotes" {...register("customerNotes")} />
              <FormErrorMessage>
                {errors.customerNotes?.message}
              </FormErrorMessage>
              <FormHelperText>Include a note for the customer.</FormHelperText>
            </FormControl>
          </GridItem>
        </Grid>

        <Flex justify="space-evenly" mt={4}>
          <Button onClick={goBack} isLoading={loading} mr={4}>
            prev
          </Button>
          <Button isLoading={loading} colorScheme="cyan" type="submit">
            finish
          </Button>
        </Flex>
      </Box>
    </VStack>
  );
}

export default InvoiceDetailsForm;
