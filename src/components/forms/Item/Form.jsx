import { useMemo, useEffect } from 'react';
import {
  Button,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  // FormHelperText,
  // Switch,
  Textarea,
  FormHelperText,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useForm, FormProvider, Controller } from 'react-hook-form';
//
//
//
import NumInput from '../../ui/NumInput';
import ControlledGroupedOptionsSelect from 'components/ui/selects/ControlledGroupedOptionsSelect';
import CustomSelect from 'components/ui/CustomSelect';

export default function Form(props) {
  // console.log({ props });

  const { handleFormSubmit, item, carMakes, carModels, updating } = props;

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: {
      name: item?.name || '',
      make: item?.make || '',
      model: item?.model || null,
      year: item?.year || '',
      rate: item?.rate || 0,
      description: item?.description || '',
      // type: item?.type || '',
      //   skuOption: item?.skuOption || 'barcode',
      // salesAccount: item?.salesAccount?.accountId || 'sales',
      // salesTax: item?.salesTax?.taxId || '',
      // pricesIncludeTax: item?.pricesIncludeTax || false,
    },
  });

  const {
    handleSubmit,
    formState: {
      //  dirtyFields,
      errors,
    },
    watch,
    register,
    control,
    setValue,
    getValues,
  } = formMethods;

  const carMake = watch('make');
  const carModel = watch('model');

  useEffect(() => {
    const selectedModelData = getValues('model');
    if (selectedModelData) {
      const carMakeData = carModels[carMake] || {};
      const carModelData = carMakeData[selectedModelData?.model || ''];

      console.log({ carModelData });

      if (!carModelData) {
        setValue('model', null);
      }
    }
  }, [carMake, setValue, carModels, getValues]);

  const selectedCarModels = useMemo(() => {
    const selectedModels = Object.values(carModels[carMake] || {});

    return selectedModels;
  }, [carMake, carModels]);

  const selectedModelYears = carModel?.years || [];

  console.log({ selectedCarModels, selectedModelYears });

  return (
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
            isInvalid={errors.name}
          >
            <FormLabel htmlFor="name">Registration</FormLabel>
            <Input
              id="name"
              {...register('name', {
                required: { value: true, message: 'Required' },
              })}
            />

            <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={[12, 6]}>
          <FormControl isDisabled={updating} isInvalid={errors.rate}>
            <FormLabel htmlFor="rate">Rate per Day (ksh)</FormLabel>
            <NumInput
              name="rate"
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

            <FormErrorMessage>{errors?.rate?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={[12, 6]}>
          <FormControl isDisabled={updating} isInvalid={errors.make}>
            <FormLabel htmlFor="make">Car Make</FormLabel>
            <CustomSelect
              name="make"
              placeholder="Car Make"
              isDisabled={updating}
              options={carMakes.map(make => ({
                name: make,
                value: make,
              }))}
            />
            <FormErrorMessage>{errors?.make?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={[12, 6]}>
          <FormControl isDisabled={updating} isInvalid={errors.model}>
            <FormLabel htmlFor="model">Model</FormLabel>

            <Controller
              name="model"
              control={control}
              render={({ field: { name, onChange, onBlur, value } }) => {
                return (
                  <ControlledGroupedOptionsSelect
                    placeholder="Select Car Model"
                    selectedValue={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    name={name}
                    options={
                      carMake
                        ? selectedCarModels
                        : [
                            {
                              make: '',
                              model: 'No Car Make Selected!',
                              year: '',
                              id: '',
                            },
                          ]
                    }
                    optionsConfig={{
                      nameField: 'model',
                      valueField: 'model',
                      groupNameField: ['make'],
                    }}
                  />
                );
              }}
            />

            <FormErrorMessage>{errors?.model?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={[12, 6]}>
          <FormControl isDisabled={updating} isInvalid={errors.year}>
            <FormLabel htmlFor="year">Year</FormLabel>

            <CustomSelect
              name="year"
              placeholder="year of manufacture"
              isDisabled={updating}
              options={selectedModelYears.map(year => ({
                name: String(year),
                value: String(year),
              }))}
            />
            <FormErrorMessage>{errors?.year?.message}</FormErrorMessage>
            <FormHelperText>Year of Manufacture</FormHelperText>
          </FormControl>
        </GridItem>

        {/* <GridItem colSpan={[12, 6]}>
          <FormControl isDisabled={updating} isInvalid={errors.salesTax}>
            <FormLabel htmlFor="salesTax">Tax</FormLabel>
            <CustomSelect
              name="salesTax"
              placeholder="sales tax"
              isDisabled={updating}
              options={taxes.map((tax, i) => {
                const { name, rate, taxId } = tax;

                return {
                  name: `${name} - ${rate}%`,
                  value: taxId,
                };
              })}
            />
            <FormErrorMessage>{errors?.salesTax?.message}</FormErrorMessage>
            <FormHelperText>Add tax to your item</FormHelperText>
          </FormControl>
        </GridItem> */}

        {/* <GridItem colSpan={[12, 6]}>
          <FormControl
            isDisabled={updating}
            w="full"
            // isRequired={salesTax}
            isInvalid={errors.pricesIncludeTax}
          >
            <FormLabel htmlFor="pricesIncludeTax">
              Prices Include Tax?
            </FormLabel>
            <Switch
              {...register('pricesIncludeTax')}
              id="pricesIncludeTax"
              isDisabled={updating}
            />

            <FormErrorMessage>
              {errors?.pricesIncludeTax?.message}
            </FormErrorMessage>
          </FormControl>
        </GridItem> */}

        {/* <GridItem colSpan={12}>
        <FormControl
          isDisabled={updating}
          isRequired
          isInvalid={errors.salesAccount}
          display={itemIsVehicle ? 'none' : 'block'}
        >
          <FormLabel htmlFor="salesAccount">Account</FormLabel>
          <CustomSelect
            name="salesAccount"
            placeholder="sales account"
            isDisabled={updating}
            rules={{ required: { value: true, message: 'Required' } }}
            options={accounts.map((account, i) => {
              const { name, accountId } = account;
              return {
                name,
                value: accountId,
              };
            })}
          />
          <FormErrorMessage>{errors?.salesAccount?.message}</FormErrorMessage>
        </FormControl>
      </GridItem> */}

        <GridItem colSpan={12}>
          <FormControl isDisabled={updating} isInvalid={errors.description}>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Textarea id="description" {...register('description')} />
            <FormErrorMessage>{errors?.description?.message}</FormErrorMessage>
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
  );
}

Form.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  updating: PropTypes.bool.isRequired,
  item: PropTypes.object,
  carModels: PropTypes.object,
  accounts: PropTypes.array.isRequired,
};
