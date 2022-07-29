import { useContext, useCallback } from "react";
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  FormHelperText,
  FormErrorMessage,
  Button,
  Grid,
  GridItem,
  Container,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import PropTypes from "prop-types";

import { deriveDueDate } from "../../../utils/invoices";

import StepperContext from "../../../contexts/StepperContext";

import CustomSelect from "../../ui/CustomSelect";
import CustomDatePicker from "../../ui/CustomDatePicker";
import { useEffect } from "react";

function InvoiceForm(props) {
  const { customers, paymentTerms, loading } = props;
  const { nextStep } = useContext(StepperContext);

  const {
    register,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useFormContext();

  const customerId = watch("customer");
  const paymentTermId = watch("paymentTerm");
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
      const { paymentTerm } = getCustomer(customerId);
      //update payment term field
      setValue("paymentTerm", paymentTerm.value);
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

  async function next() {
    await trigger([
      "customer",
      "orderNumber",
      "invoiceDate",
      "paymentTerm",
      "dueDate",
      "subject",
      "customerNotes",
    ]);

    const fieldsValid = Object.keys(errors).length === 0;

    if (fieldsValid) {
      //move to the next step if all fields are valid
      nextStep();
    }
  }

  return (
    <Container py={4}>
      <Grid rowGap={2} columnGap={4} templateColumns="repeat(12, 1fr)">
        <GridItem colSpan={[12, 6]}>
          <FormControl
            isDisabled={loading}
            isRequired
            isInvalid={errors.customer}
          >
            <FormLabel htmlFor="customer">Customer</FormLabel>
            <CustomSelect
              name="customer"
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
            <FormErrorMessage>{errors.invoiceDate?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={[12, 4]}>
          <FormControl
            isDisabled={loading}
            isRequired
            isInvalid={errors.paymentTerm}
          >
            <FormLabel htmlFor="paymentTerm">Terms</FormLabel>
            <CustomSelect
              name="paymentTerm"
              options={paymentTerms || []}
              isDisabled={!customerId || loading}
            />
            <FormErrorMessage>{errors.paymentTerm?.message}</FormErrorMessage>
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
          <FormControl isDisabled={loading} isInvalid={errors.customerNotes}>
            <FormLabel htmlFor="customerNotes">Customer Notes</FormLabel>
            <Textarea id="customerNotes" {...register("customerNotes")} />
            <FormErrorMessage>{errors.customerNotes?.message}</FormErrorMessage>
            <FormHelperText>Include a note for the customer.</FormHelperText>
          </FormControl>
        </GridItem>
      </Grid>

      <Flex justify="space-evenly" mt={4}>
        <Button
          onClick={next}
          isLoading={loading}
          colorScheme="cyan"
          type="button"
        >
          next
        </Button>
      </Flex>
    </Container>
  );
}

InvoiceForm.propTypes = {
  customers: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  paymentTerms: PropTypes.array.isRequired,
};

export default InvoiceForm;
