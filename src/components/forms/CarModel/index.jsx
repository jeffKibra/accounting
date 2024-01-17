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
import { useForm, FormProvider } from 'react-hook-form';
//
import NumInput from '../../ui/NumInput';
import RHFSimpleSelect from 'components/ui/hookForm/RHFSimpleSelect';
// import CustomSelect from '../../ui/CustomSelect';

export default function CarModelForm(props) {
  // console.log({ props });

  const { handleFormSubmit, carModel, updating } = props;
  // console.log({ accounts });

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: {
      make: carModel?.make || '',
      model: carModel?.model || '',
      year: carModel?.year || 0,
    },
  });

  const {
    handleSubmit,
    formState: {
      //  dirtyFields,
      errors,
    },
    register,
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
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <GridItem colSpan={[12, 6]}>
            <FormControl
              isReadOnly={updating}
              w="full"
              isRequired
              isInvalid={errors.make}
            >
              <FormLabel htmlFor="make">Car Make</FormLabel>

              <RHFSimpleSelect
                id="make"
                name="make"
                isDisabled={updating}
                placeholder="Select Car make"
                options={[]}
                controllerProps={{
                  rules: { required: { value: true, message: 'Required' } },
                }}
              />

              <FormErrorMessage>{errors?.make?.message}</FormErrorMessage>
              <FormHelperText>Car Manufacturer e.g Toyota</FormHelperText>
            </FormControl>
          </GridItem>

          <GridItem colSpan={[12, 6]}>
            <FormControl
              isReadOnly={updating}
              w="full"
              isRequired
              isInvalid={errors.model}
            >
              <FormLabel htmlFor="model">Car Model</FormLabel>
              <Input
                id="model"
                {...register('model', {
                  required: { value: true, message: 'Required' },
                })}
              />

              <FormErrorMessage>{errors?.model?.message}</FormErrorMessage>
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
            <FormControl isDisabled={updating} isInvalid={errors.year}>
              <FormLabel htmlFor="year">Year of Manufacture</FormLabel>
              <NumInput
                name="year"
                min={0}
                size="md"
                rules={{
                  // required: { value: true, message: '*Required!' },
                  min: {
                    value: 0,
                    message: 'Value should be a positive integer!',
                  },
                }}
              />

              <FormErrorMessage>{errors?.year?.message}</FormErrorMessage>
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

CarModelForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  updating: PropTypes.bool.isRequired,
  carModel: PropTypes.object,
};
