import { useEffect, useContext, useMemo } from "react";
import {
  FormControl,
  Input,
  FormLabel,
  FormErrorMessage,
  Textarea,
  Grid,
  GridItem,
  Flex,
  Button,
  Heading,
  Container,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useForm, FormProvider } from "react-hook-form";

import useToasts from "../../../hooks/useToasts";

import NumInput from "../../ui/NumInput";
import CustomSelect from "../../ui/CustomSelect";

import StepperContext from "../../../contexts/StepperContext";

function ExtraDetailsForm(props) {
  const {
    loading,
    defaultValues,
    handleFormSubmit,
    updateFormValues,
    paymentTerms,
    customerId,
  } = props;
  const toasts = useToasts();

  const defaults = useMemo(() => {
    return {
      paymentTermId: defaultValues?.paymentTermId || "on_receipt",
      website: defaultValues?.website || "",
      remarks: defaultValues?.remarks || "",
      ...(customerId
        ? {}
        : { openingBalance: defaultValues?.openingBalance || 0 }),
    };
  }, [defaultValues, customerId]);

  const { prevStep } = useContext(StepperContext);

  const formMethods = useForm({
    mode: "onChange",
    defaultValues: { ...defaults },
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    getValues,
  } = formMethods;

  useEffect(() => {
    if (defaults) {
      reset({ ...defaults });
    }
  }, [defaults, reset]);

  function goBack() {
    const all = getValues();

    updateFormValues(all);
    prevStep();
  }

  function saveData(data) {
    const { paymentTermId } = data;
    const paymentTerm = paymentTerms.find(
      (term) => term.value === paymentTermId
    );

    if (!paymentTerm) {
      toasts.error("Selected Payment Term not found!");
    }

    handleFormSubmit({ ...data, paymentTerm });
  }

  return (
    <FormProvider {...formMethods}>
      <Container
        p={4}
        bg="white"
        borderRadius="md"
        shadow="md"
        maxW="container.sm"
      >
        <Heading size="sm" textAlign="center">
          Extra Details
        </Heading>

        <Container
          py={6}
          as="form"
          role="form"
          onSubmit={handleSubmit(saveData)}
        >
          <Grid
            columnGap={4}
            rowGap={2}
            templateColumns="repeat(12, 1fr)"
            mt="4px"
            mb="4px"
          >
            {customerId ? null : (
              <GridItem colSpan={[12, 6]}>
                <FormControl
                  isDisabled={loading}
                  isInvalid={!!errors.openingBalance}
                >
                  <FormLabel htmlFor="openingBalance">
                    Opening Balance
                  </FormLabel>
                  <NumInput
                    name="openingBalance"
                    min={0}
                    rules={{
                      min: {
                        value: 0,
                        message: "Value cannot be less than zero(0)!",
                      },
                    }}
                  />
                  <FormErrorMessage>
                    {errors.openingBalance?.message}
                  </FormErrorMessage>
                </FormControl>
              </GridItem>
            )}

            <GridItem colSpan={[12, 6]}>
              <FormControl
                isDisabled={loading}
                isRequired
                isInvalid={!!errors.paymentTermId}
              >
                <FormLabel htmlFor="paymentTermId">Payment Terms</FormLabel>
                <CustomSelect
                  isDisabled={loading}
                  name="paymentTermId"
                  placeholder="terms"
                  options={paymentTerms}
                  rules={{ required: { value: true, message: "*Required!" } }}
                />
                <FormErrorMessage>
                  {errors.paymentTermId?.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[12, 6]}>
              <FormControl isDisabled={loading} isInvalid={!!errors.website}>
                <FormLabel htmlFor="website">website</FormLabel>
                <Input id="website" {...register("website")} />
                <FormErrorMessage>{errors.website?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[12, 6]}>
              <FormControl isDisabled={loading} isInvalid={!!errors.remarks}>
                <FormLabel htmlFor="remarks">Remarks</FormLabel>
                <Textarea resize="none" id="remarks" {...register("remarks")} />
                <FormErrorMessage>{errors.remarks?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
          </Grid>

          <Flex justifyContent="space-around" mt={4}>
            <Button
              isLoading={loading}
              variant="outline"
              colorScheme="cyan"
              onClick={goBack}
            >
              prev
            </Button>

            <Button
              isLoading={loading}
              variant="outline"
              colorScheme="cyan"
              type="submit"
            >
              save
            </Button>
          </Flex>
        </Container>
      </Container>
    </FormProvider>
  );
}

ExtraDetailsForm.propTypes = {
  loading: PropTypes.bool.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  updateFormValues: PropTypes.func,
  paymentTerms: PropTypes.array.isRequired,
  defaultValues: PropTypes.shape({
    website: PropTypes.string,
    remarks: PropTypes.string,
    paymentTermId: PropTypes.string,
    openingBalance: PropTypes.number,
  }),
  customerId: PropTypes.string,
};

export default ExtraDetailsForm;
