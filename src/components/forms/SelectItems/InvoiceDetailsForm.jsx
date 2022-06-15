import { useContext, useCallback, useMemo } from "react";
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

import { deriveDueDate } from "../../../utils/invoices";
import { confirmFutureDate } from "../../../utils/dates";

import useToasts from "../../../hooks/useToasts";

import InvoicesContext from "../../../contexts/InvoicesContext";
import StepperContext from "../../../contexts/StepperContext";

import CustomSelect from "../../ui/CustomSelect";
import CustomDatePicker from "../../ui/CustomDatePicker";
import { useEffect } from "react";

function InvoiceDetailsForm() {
  const { formValues, updateFormValues, customers, loading, paymentTerms } =
    useContext(InvoicesContext);
  const { nextStep } = useContext(StepperContext);

  const defaults = useMemo(() => {
    const today = new Date();

    return {
      customerId: formValues?.customerId || "",
      orderNumber: formValues?.orderNumber || "",
      invoiceDate: formValues?.invoiceDate || today,
      paymentTermId: formValues?.paymentTermId || "on_receipt",
      dueDate: formValues?.dueDate || today,
      subject: formValues?.subject || "",
      customerNotes: formValues?.customerNotes || "",
    };
  }, [formValues]);

  const formMethods = useForm({
    mode: "onChange",
    defaultValues: { ...defaults },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = formMethods;
  /**
   * if defaults change, update form field
   */
  useEffect(() => {
    if (defaults) {
      reset(defaults);
    }
  }, [defaults, reset]);

  const customerId = watch("customerId");
  const paymentTermId = watch("paymentTermId");
  const invoiceDate = watch("invoiceDate");

  const getCustomer = useCallback(
    (customerId) => {
      return customers.find((customer) => customer.customerId === customerId);
    },
    [customers]
  );
  /**
   * update payment term according to customer preference
   */
  useEffect(() => {
    if (customerId) {
      const { paymentTermId: ptId } = getCustomer(customerId);
      //update payment term field
      setValue("paymentTermId", ptId);
    }
  }, [customerId, getCustomer, setValue]);
  /**
   * update due date according to the selected payment term
   */
  useEffect(() => {
    if (paymentTermId) {
      const paymentTerm = paymentTerms.find(
        (term) => term.value === paymentTermId
      );
      const dueDate = deriveDueDate(paymentTerm, invoiceDate);
      setValue("dueDate", dueDate);
    }
  }, [paymentTermId, invoiceDate, paymentTerms, setValue]);

  const toasts = useToasts();

  function onSubmit(data) {
    const { customerId, invoiceDate, dueDate, paymentTermId } = data;
    /**
     * ensure dueDate is not a past date
     */
    const dueDateIsFuture = confirmFutureDate(invoiceDate, dueDate);
    if (!dueDateIsFuture) {
      return toasts.error("Due date cannot be less than invoice date");
    }

    const customer = getCustomer(customerId);
    const paymentTerm = paymentTerms.find(
      (term) => term.value === paymentTermId
    );

    const newData = {
      ...data,
      customer,
      paymentTerm,
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

            <GridItem colSpan={[12, 4]}>
              <FormControl
                isDisabled={loading}
                isRequired
                isInvalid={errors.invoiceDate}
              >
                <FormLabel htmlFor="invoiceDate">Invoice Date</FormLabel>
                <CustomDatePicker name="invoiceDate" required />
                <FormErrorMessage>
                  {errors.invoiceDate?.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[12, 4]}>
              <FormControl
                isDisabled={loading}
                isRequired
                isInvalid={errors.paymentTermId}
              >
                <FormLabel htmlFor="paymentTermId">Terms</FormLabel>
                <CustomSelect
                  name="paymentTermId"
                  options={paymentTerms || []}
                  isDisabled={!customerId || loading}
                />
                <FormErrorMessage>
                  {errors.paymentTermId?.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[12, 4]}>
              <FormControl
                isDisabled={loading}
                isRequired
                isInvalid={errors.dueDate}
              >
                <FormLabel htmlFor="dueDate">Due Date</FormLabel>
                <CustomDatePicker name="dueDate" required />
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
