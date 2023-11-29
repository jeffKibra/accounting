import { useContext } from 'react';
import {
  FormControl,
  Input,
  Textarea,
  Grid,
  GridItem,
  Divider,
  Flex,
  Button,
  Heading,
  Container,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';

import StepperContext from '../../../contexts/StepperContext';

//-------------------------------------------------------------------------------------------------

export const addressPropTypes = PropTypes.shape({
  street: PropTypes.string,
  city: PropTypes.string,
  state: PropTypes.string,
  postalCode: PropTypes.string,
  country: PropTypes.string,
});

//-------------------------------------------------------------------------------------------------

function AddressForm(props) {
  const { loading } = props;
  const { nextStep, prevStep } = useContext(StepperContext);

  const {
    register,
    formState: { errors },
    setValue,
    getValues,
    trigger,
  } = useFormContext();
  // console.log({ details });

  function copyBilling() {
    const [street, city, state, postalCode, country] = getValues([
      'billingAddress.street',
      'billingAddress.city',
      'billingAddress.state',
      'billingAddress.postalCode',
      'billingAddress.country',
    ]);
    // console.log({ street, city, state, postalCode, country });
    setValue('shippingAddress.street', street, { shouldDirty: true });
    setValue('shippingAddress.city', city, { shouldDirty: true });
    setValue('shippingAddress.state', state, { shouldDirty: true });
    setValue('shippingAddress.postalCode', postalCode, { shouldDirty: true });
    setValue('shippingAddress.country', country, { shouldDirty: true });
  }

  async function next() {
    //trigger validation
    await trigger([
      'billingAddress.street',
      'billingAddress.city',
      'billingAddress.state',
      'billingAddress.postalCode',
      'billingAddress.country',
      'shippingAddress.street',
      'shippingAddress.city',
      'shippingAddress.state',
      'shippingAddress.postalCode',
      'shippingAddress.country',
    ]);
    const fieldsValid = Object.keys(errors).length === 0;

    if (fieldsValid) {
      nextStep();
    }
  }

  return (
    <Container py={6} maxW="container.sm">
      {/* <Heading size="sm" textAlign="center">
        Address
      </Heading> */}
      <Grid
        columnGap={4}
        rowGap={2}
        templateColumns="repeat(12, 1fr)"
        mt={1}
        mb={1}
      >
        <GridItem colSpan={[12, null, 6]}>
          <Grid
            columnGap={2}
            rowGap={2}
            templateColumns="repeat(12, 1fr)"
            mt={1}
            mb={1}
          >
            <GridItem colSpan={12}>
              <Heading color="#718096" size="sm">
                Billing address
              </Heading>

              <Divider />
            </GridItem>
            <GridItem colSpan={12}>
              <FormControl
                isDisabled={loading}
                isInvalid={!!errors?.billingAddress?.street}
              >
                <Textarea
                  placeholder="Street"
                  id="billingStreet"
                  {...register('billingAddress.street')}
                />
              </FormControl>
            </GridItem>

            <GridItem colSpan={6}>
              <FormControl
                isDisabled={loading}
                isInvalid={!!errors?.billingAddress?.city}
              >
                <Input
                  placeholder="City | Town"
                  id="billingCity"
                  {...register('billingAddress.city')}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={6}>
              <FormControl
                isDisabled={loading}
                isInvalid={!!errors?.billingAddress?.state}
              >
                <Input
                  placeholder="State | Province"
                  id="billingState"
                  {...register('billingAddress.state')}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={6}>
              <FormControl
                isDisabled={loading}
                isInvalid={!!errors?.billingAddress?.postalCode}
              >
                <Input
                  placeholder="Postal code"
                  id="billingPostalCode"
                  {...register('billingAddress.postalCode')}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={6}>
              <FormControl
                isDisabled={loading}
                isInvalid={!!errors?.billingAddress?.country}
              >
                <Input
                  placeholder="Country"
                  id="billingCountry"
                  {...register('billingAddress.country')}
                />
              </FormControl>
            </GridItem>
          </Grid>
        </GridItem>

        <GridItem colSpan={[12, null, 6]}>
          <Grid
            columnGap={2}
            rowGap={2}
            templateColumns="repeat(12, 1fr)"
            mt={1}
            mb={1}
          >
            <GridItem colSpan={12}>
              <Flex w="full" justify="space-between">
                <Heading color="#718096" size="sm" mr={1}>
                  Shipping address
                </Heading>
                <Button
                  onClick={copyBilling}
                  size="xs"
                  colorScheme="cyan"
                  variant="outline"
                >
                  Copy billing address
                </Button>
              </Flex>

              <Divider />
            </GridItem>
            <GridItem colSpan={12}>
              <FormControl
                isDisabled={loading}
                isInvalid={!!errors?.shippingAddress?.street}
              >
                <Textarea
                  placeholder="Street"
                  id="shippingStreet"
                  {...register('shippingAddress.street')}
                />
              </FormControl>
            </GridItem>

            <GridItem colSpan={6}>
              <FormControl
                isDisabled={loading}
                isInvalid={!!errors?.shippingAddress?.city}
              >
                <Input
                  placeholder="City | Town"
                  id="shippingCity"
                  {...register('shippingAddress.city')}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={6}>
              <FormControl
                isDisabled={loading}
                isInvalid={!!errors?.shippingAddress?.state}
              >
                <Input
                  placeholder="State | Province"
                  id="shippingState"
                  {...register('shippingAddress.state')}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={6}>
              <FormControl
                isDisabled={loading}
                isInvalid={!!errors?.shippingAddress?.postalCode}
              >
                <Input
                  placeholder="Postal code"
                  id="shippingPostalCode"
                  {...register('shippingAddress.postalCode')}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={6}>
              <FormControl
                isDisabled={loading}
                isInvalid={!!errors?.shippingAddress?.country}
              >
                <Input
                  placeholder="Country"
                  id="shippingCountry"
                  {...register('shippingAddress.country')}
                />
              </FormControl>
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
      <Flex justifyContent="space-around" mt={4}>
        <Button
          isLoading={loading}
          variant="outline"
          colorScheme="cyan"
          type="button"
          onClick={prevStep}
        >
          back
        </Button>
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

AddressForm.propTypes = {
  loading: PropTypes.bool.isRequired,
};

export default AddressForm;
