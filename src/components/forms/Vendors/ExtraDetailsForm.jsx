import { useContext } from "react";
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
  // Heading,
  Container,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";

// import NumInput from "../../ui/NumInput";
import CustomSelect from "../../ui/CustomSelect";

import StepperContext from "../../../contexts/StepperContext";

function ExtraDetailsForm(props) {
  const {
    loading,
    paymentTerms,
    // vendorId,
  } = props;

  const { prevStep } = useContext(StepperContext);

  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Container py={6}>
      {/* <Heading size="sm" textAlign="center">
          Extra Details
        </Heading> */}
      <Grid
        columnGap={4}
        rowGap={2}
        templateColumns="repeat(12, 1fr)"
        mt="4px"
        mb="4px"
      >
        {/* {vendorId ? null : (
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
            )} */}

        <GridItem colSpan={[12, 6]}>
          <FormControl
            isDisabled={loading}
            isRequired
            isInvalid={!!errors.paymentTerm}
          >
            <FormLabel htmlFor="paymentTerm">Payment Terms</FormLabel>
            <CustomSelect
              isDisabled={loading}
              name="paymentTerm"
              placeholder="terms"
              options={paymentTerms}
              rules={{ required: { value: true, message: "*Required!" } }}
            />
            <FormErrorMessage>{errors.paymentTerm?.message}</FormErrorMessage>
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
          onClick={prevStep}
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
  );
}

ExtraDetailsForm.propTypes = {
  loading: PropTypes.bool.isRequired,
  paymentTerms: PropTypes.array.isRequired,
  vendorId: PropTypes.string,
};

export default ExtraDetailsForm;
