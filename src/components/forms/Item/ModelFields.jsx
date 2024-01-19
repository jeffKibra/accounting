import { useMemo, useCallback, useState } from 'react';
import {
  GridItem,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
//
//
//
// import NumInput from '../../ui/NumInput';
// import ControlledGroupedOptionsSelect from 'components/ui/selects/ControlledGroupedOptionsSelect';
import CustomSelect from 'components/ui/CustomSelect';
//
import SelectVehicleMakeInput from '../VehicleModel/SelectVehicleMakeInput';
import SelectVehicleModelInput from '../VehicleModel/SelectVehicleModelInput';
//

export default function ModelFields(props) {
  // console.log({ props });

  const [originalModel, setOriginalModel] = useState(null);

  const { updating } = props;

  const formMethods = useFormContext();

  const {
    formState: { errors },
    watch,
    control,
    setValue,
  } = formMethods;

  const selectedMake = watch('make') || '';
  // const vehicleModel = watch('model');
  // console.log({ selectedMake, vehicleModel });

  const extractSelectedModelCB = useCallback(incomingModelObject => {
    console.log({ incomingModelObject });

    setOriginalModel(currentModelObject => {
      const currentModelName = currentModelObject?.name || '';
      const incomingModelName = incomingModelObject?.name || '';

      if (currentModelName === incomingModelName) {
        return currentModelObject;
      } else {
        return incomingModelObject;
      }
    });
  }, []);

  //
  const yearsString = originalModel?.years || '';
  console.log({ originalModel, yearsString });

  const yearsArray = useMemo(() => {
    const array = [];
    String(yearsString)
      .split(',')
      .forEach(year => array.push(String(year).trim()));

    return array;
  }, [yearsString]);

  // console.log({ selectedVehicleModels, selectedModelYears });

  return (
    <>
      <GridItem colSpan={[12, 6]}>
        <FormControl isRequired isReadOnly={updating} isInvalid={errors.make}>
          <FormLabel htmlFor="make">Vehicle Make</FormLabel>

          <Controller
            name="make"
            control={control}
            rules={{
              required: { value: true, message: 'Required * ' },
            }}
            render={({ field: { onChange, onBlur, value } }) => {
              function handleChange(data) {
                // console.log('vehicle make has changed', data);
                const makeName = data?.name;
                // console.log({ makeName });
                onChange(makeName);
              }

              return (
                <>
                  <SelectVehicleMakeInput
                    onChange={handleChange}
                    onBlur={onBlur}
                    value={value}
                    disabled={updating}
                  />
                </>
              );
            }}
          />

          <FormErrorMessage>{errors?.make?.message}</FormErrorMessage>
        </FormControl>
      </GridItem>

      <GridItem colSpan={[12, 6]}>
        <FormControl isRequired isReadOnly={updating} isInvalid={errors.model}>
          <FormLabel htmlFor="model">Model</FormLabel>

          <Controller
            name="model"
            control={control}
            rules={{
              required: { value: true, message: 'Required * ' },
            }}
            render={({ field: { onChange, onBlur, value } }) => {
              function handleChange(data) {
                console.log('vehicle model has changed ', { data });
                const modelName = data?.name || '';
                onChange(modelName);

                const modelType = data?.type || '';
                console.log({ modelType });
                setValue('type', modelType);
              }

              return (
                <SelectVehicleModelInput
                  make={selectedMake}
                  onChange={handleChange}
                  onBlur={onBlur}
                  value={value}
                  disabled={updating}
                  extractSelectedModelCB={extractSelectedModelCB}
                />
              );
            }}
          />

          <FormErrorMessage>{errors?.model?.message}</FormErrorMessage>
        </FormControl>
      </GridItem>

      <Controller name="type" control={control} render={() => null} />

      <GridItem colSpan={[12, 6]}>
        <FormControl isReadOnly={updating} isInvalid={errors.year}>
          <FormLabel htmlFor="year">Year</FormLabel>

          <CustomSelect
            name="year"
            placeholder="year of manufacture"
            isDisabled={updating}
            options={yearsArray.map(year => ({
              name: String(year),
              value: String(year),
            }))}
          />
          <FormErrorMessage>{errors?.year?.message}</FormErrorMessage>
          <FormHelperText>Year of Manufacture</FormHelperText>
        </FormControl>
      </GridItem>
    </>
  );
}

ModelFields.propTypes = {
  updating: PropTypes.bool.isRequired,
};
