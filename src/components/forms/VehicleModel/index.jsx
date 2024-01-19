import {
  Button,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  FormHelperText,
  Box,
  // Switch,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useForm, FormProvider, Controller } from 'react-hook-form';
//
//
// import NumInput from '../../ui/NumInput';
// import RHFSimpleSelect from 'components/ui/hookForm/RHFSimpleSelect';
import SelectVehicleMakeInput from './SelectVehicleMakeInput';
// import CustomSelect from '../../ui/CustomSelect';

export default function VehicleModelForm(props) {
  // console.log({ props });

  const { onSubmit, vehicleModel, updating } = props;
  // console.log({ accounts });

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: {
      make: vehicleModel?.make || '',
      name: vehicleModel?.name || '',
      type: vehicleModel?.type || '',
      years: vehicleModel?.years || '',
    },
  });

  const {
    handleSubmit,
    formState: {
      //  dirtyFields,
      errors,
    },
    register,
    control,
  } = formMethods;

  return (
    <Box w="full">
      <FormProvider {...formMethods}>
        <Grid
          borderRadius="md"
          shadow="xl"
          border="1px solid #f2f2f2"
          p={6}
          rowGap={6}
          columnGap={6}
          templateColumns="repeat(12, 1fr)"
          w="full"
          as="form"
          role="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <GridItem colSpan={[12, 6]}>
            <FormControl
              isReadOnly={updating}
              w="full"
              isRequired
              isInvalid={errors.make}
            >
              <FormLabel htmlFor="make">Vehicle Make</FormLabel>

              <Controller
                name="make"
                control={control}
                render={({ field: { onBlur, onChange, value } }) => {
                  function handleChange(selectedVehicleMake) {
                    // console.log({ selectedVehicleMake });
                    onChange(selectedVehicleMake?.name || '');
                  }

                  // console.log({ value });

                  return (
                    <SelectVehicleMakeInput
                      onChange={handleChange}
                      value={value}
                      onBlur={onBlur}
                      disabled={updating}
                    />
                  );
                }}
              />

              <FormErrorMessage>{errors?.make?.message}</FormErrorMessage>
              <FormHelperText>Vehicle Manufacturer e.g Toyota</FormHelperText>
            </FormControl>
          </GridItem>

          <GridItem colSpan={[12, 6]}>
            <FormControl
              isReadOnly={updating}
              w="full"
              isRequired
              isInvalid={errors.name}
            >
              <FormLabel htmlFor="name">Model Name</FormLabel>
              <Input
                id="name"
                {...register('name', {
                  required: { value: true, message: 'Required' },
                })}
              />

              <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
              <FormHelperText>E.g Corolla</FormHelperText>
            </FormControl>
          </GridItem>

          <GridItem colSpan={[12, 6]}>
            <FormControl
              isReadOnly={updating}
              w="full"
              isRequired
              isInvalid={errors.type}
            >
              <FormLabel htmlFor="model">Type</FormLabel>
              <Input
                id="type"
                {...register('type', {
                  required: { value: true, message: 'Required' },
                })}
              />

              <FormErrorMessage>{errors?.type?.message}</FormErrorMessage>
              <FormHelperText>E.g Coupe SUV</FormHelperText>
            </FormControl>
          </GridItem>

          <GridItem colSpan={[12, 6]}>
            <FormControl isDisabled={updating} isInvalid={errors.years}>
              <FormLabel htmlFor="years">Years of Manufacture</FormLabel>
              <Input
                id="years"
                {...register('years', {
                  required: { value: true, message: 'Required' },
                })}
              />

              <FormErrorMessage>{errors?.years?.message}</FormErrorMessage>
              <FormHelperText>
                Enter a coma(,) separated list of years
              </FormHelperText>
            </FormControl>
          </GridItem>

          <GridItem colSpan={12} display="flex" justifyContent="flex-end">
            <Button
              size="lg"
              colorScheme="cyan"
              type="submit"
              isLoading={updating}
            >
              save
            </Button>
          </GridItem>
        </Grid>
      </FormProvider>
    </Box>
  );
}

VehicleModelForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  updating: PropTypes.bool.isRequired,
  vehicleModel: PropTypes.object,
};
