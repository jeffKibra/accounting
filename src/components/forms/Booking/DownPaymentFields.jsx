import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Grid,
  GridItem,
  Box,
} from '@chakra-ui/react';
import { useFormContext, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
//

// import CustomSelect from '../../ui/CustomSelect';
import RHFSimpleSelect from 'components/ui/hookForm/RHFSimpleSelect';
// import CustomDatePicker from '../../ui/CustomDatePicker';
import ControlledNumInput from 'components/ui/ControlledNumInput';
// import ControlledSelect from 'components/ui/ControlledSelect';

//---------------------------------------------------------------
DownPaymentFields.propTypes = {
  loading: PropTypes.bool.isRequired,
  // paymentTerms: PropTypes.array.isRequired,
  paymentModes: PropTypes.array.isRequired,
  bookingId: PropTypes.string,
  currentBookingDetails: PropTypes.object,
};

export default function DownPaymentFields(props) {
  const { loading, paymentModes } = props;

  // console.log({ paymentModes });

  const {
    register,
    formState: { errors },
    control,
  } = useFormContext();
  // console.log({ errors });

  return (
    <Box w="full" p={4}>
      <Grid rowGap={2} columnGap={4} templateColumns="repeat(12, 1fr)">
        <GridItem colSpan={12}>
          <FormControl
            isDisabled={loading}
            isRequired
            isInvalid={errors?.paymentMode}
          >
            <FormLabel htmlFor="payment_mode">Payment Mode</FormLabel>

            <RHFSimpleSelect
              name="paymentMode"
              placeholder="select payment mode"
              id="payment_mode"
              isDisabled={loading}
              options={paymentModes}
              optionsConfig={{ nameField: 'name', valueField: '_id' }}
              controllerProps={{
                rules: {
                  required: { value: true, message: '*Required!' },
                },
              }}
            />
            {/* <Controller
              name="paymentMode"
              control={control}
              render={({ field: { onBlur, onChange, value } }) => {
                function handleChange(paymentModeId) {
                  const paymentMode = paymentModes[paymentModeId];

                  onChange(paymentMode);
                }

                return (
                  <ControlledSelect
                    onChange={handleChange}
                    value={value?.value || ''}
                    options={Object.values(paymentModes || {})}
                    isDisabled={loading}
                    allowClearSelection
                    onBlur={onBlur}
                    placeholder="select payment mode"
                    id="paymentMode"
                  />
                );
              }}
              rules={{
                required: { value: true, message: '*Required!' },
              }}
            /> */}

            <FormErrorMessage>{errors?.paymentMode?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={12}>
          <FormControl
            isDisabled={loading}
            isRequired
            isInvalid={errors?.amount}
          >
            <FormLabel htmlFor="downPaymentAmount">Amount</FormLabel>
            <Controller
              name="amount"
              rules={{
                required: { value: true, message: '* Required!' },
                min: {
                  value: 1,
                  message: 'Value must be greater than zero(0)!',
                },
              }}
              control={control}
              render={({ field: { value, ref, onBlur, onChange } }) => {
                return (
                  <ControlledNumInput
                    id="downPaymentAmount"
                    ref={ref}
                    updateFieldMode="onBlur"
                    value={value}
                    mode="onBlur"
                    onChange={onChange}
                    onBlur={onBlur}
                    min={1}
                    isReadOnly={loading}
                  />
                );
              }}
            />

            <FormErrorMessage>{errors?.amount?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={12}>
          <FormControl isDisabled={loading} isInvalid={errors?.reference}>
            <FormLabel htmlFor="reference">Reference#</FormLabel>
            <Input id="reference" {...register('reference')} />
            <FormErrorMessage>{errors?.reference?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
      </Grid>

      {/* <Flex justify="space-evenly" mt={4}>
        <Button
          onClick={prevStep}
          isDisabled={loading}
          type="button"
          colorScheme="cyan"
          variant="outline"
        >
          back
        </Button>

        <Button isLoading={loading} colorScheme="cyan" type="submit">
          save
        </Button>
      </Flex> */}
    </Box>
  );
}
