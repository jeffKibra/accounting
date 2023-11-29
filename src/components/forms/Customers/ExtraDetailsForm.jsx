import { useContext } from 'react';
import {
  FormControl,
  // Input,
  FormLabel,
  FormErrorMessage,
  Textarea,
  Grid,
  GridItem,
  Flex,
  Button,
  // Heading,
  Container,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';

// import NumInput from '../../ui/NumInput';
// import CustomSelect from '../../ui/CustomSelect';
import RHFSimpleSelect from 'components/ui/hookForm/RHFSimpleSelect';

import StepperContext from '../../../contexts/StepperContext';

//------------------------------------------------------------------------------

// const currentcyOptions = [
//   'SGD',
//   'MYR',
//   'EUR',
//   'USD',
//   'AUD',
//   'JPY',
//   'CNH',
//   'HKD',
//   'CAD',
//   'INR',
//   'DKK',
//   'GBP',
//   'RUB',
//   'NZD',
//   'MXN',
//   'IDR',
//   'TWD',
//   'THB',
//   'VND',
// ];
//----------------------------------------------------------------

function ExtraDetailsForm(props) {
  const {
    loading,
    paymentTerms,
    // customerId
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
        {/* {customerId ? null : (
          <GridItem colSpan={[12, 6]}>
            <FormControl
              isDisabled={loading}
              isInvalid={!!errors.openingBalance}
            >
              <FormLabel htmlFor="openingBalance">Opening Balance</FormLabel>
              <NumInput
                name="openingBalance"
                min={0}
                rules={{
                  min: {
                    value: 0,
                    message: 'Value cannot be less than zero(0)!',
                  },
                }}
              />
              <FormErrorMessage>
                {errors.openingBalance?.message}
              </FormErrorMessage>
            </FormControl>
          </GridItem>
        )} */}

        <GridItem
          colSpan={12}
          // colSpan={customerId ? 12 : [12, 6]}
        >
          <FormControl
            isDisabled={loading}
            isRequired
            isInvalid={!!errors.paymentTerm}
          >
            <FormLabel htmlFor="paymentTerm">Payment Terms</FormLabel>
            <RHFSimpleSelect
              name="paymentTerm"
              options={paymentTerms}
              optionsConfig={{ nameField: 'name', valueField: '_id' }}
              placeholder="customer payment term"
              isDisabled={loading}
            />

            <FormErrorMessage>{errors.paymentTerm?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={12}>
          <FormControl isDisabled={loading} isInvalid={!!errors.remarks}>
            <FormLabel htmlFor="remarks">Remarks</FormLabel>
            <Textarea resize="none" id="remarks" {...register('remarks')} />
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
  customerId: PropTypes.string,
};

export default ExtraDetailsForm;
