import { useMemo, useEffect } from 'react';
import { Box, FormControl, FormLabel } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';
//
//

import RHFCheckboxGroup from 'components/ui/hookForm/RHFCheckboxGroup';
import RHFRangeSlider from 'components/ui/hookForm/RHFRangeSlider';

function VehiclesFiltersFormFields(props) {
  /**
   * component must be wrapped in a react-hook-form FormProvider context
   */
  const { facets } = props;
  // console.log({ facets });
  const { makes, types, colors, ratesRange } = facets;

  const { watch, getValues, setValue } = useFormContext();

  const selectedMakes = watch('makes');

  // console.log({ selectedMakes });

  useEffect(() => {
    console.log('selected makes have changed', selectedMakes);
  }, [selectedMakes]);

  const { models, makesObject, modelsObject } = useMemo(() => {
    const models = [];
    const makesObject = {};
    const modelsObject = {};

    if (Array.isArray(makes)) {
      makes.forEach(make => {
        const { _id: makeId, models: makeModels } = make;

        makesObject[makeId] = make;
        // console.log({ makeId, makeModels });

        if (Array.isArray(makeModels)) {
          makeModels.forEach(makeModel => {
            const { _id: modelId } = makeModel;
            modelsObject[modelId] = makeModel;
          });
        }

        models.push(...makeModels);
      });
    }

    return { models, makesObject, modelsObject };
  }, [makes]);

  // console.log({ models, makesObject, modelsObject });

  // console.log({ models, makesObject });

  // function updateField(field, value) {
  //   setState(current => ({ ...current, [field]: value }));
  // }

  // function handleMakeChange(inValue) {
  //   setState(current => ({ ...current, make: inValue, model: '' }));
  // }

  // console.log({ carMakes, carModels });

  // console.log({ carTypes });

  // const models = useMemo(() => {
  //   let activeModels = {};

  //   if (carModels && typeof carModels === 'object' && make) {
  //     activeModels = carModels[make] || {};
  //   }

  //   return Object.keys(activeModels);
  // }, [carModels, make]);

  // console.log({ models });

  function handleMakeChange(makeId, isChecked) {
    console.log({ makeId, isChecked });
    /**
     * if not checked, unselect all models of this make
     */
    if (!isChecked) {
      const selectedModels = getValues('models');
      const selectedModelsObject = {};
      if (Array.isArray(selectedModels)) {
        selectedModels.forEach(modelId => {
          selectedModelsObject[modelId] = modelId;
        });
      }
      const makeModels = makesObject[makeId]?.models || [];
      console.log({ makeModels });

      if (Array.isArray(makeModels)) {
        makeModels.forEach(model => {
          const modelId = model._id;

          const isSelected = Boolean(selectedModelsObject[modelId]);
          console.log({ modelId, isSelected });

          if (isSelected) {
            delete selectedModelsObject[modelId];
          }
        });
      }

      const updatedModels = Object.keys(selectedModelsObject);

      setValue('modles', updatedModels);
    }
  }

  return (
    <Box w="full">
      <Box mb={6}>
        <FormControl>
          <FormLabel>Rates Range</FormLabel>
          <RHFRangeSlider
            name="ratesRange"
            min={ratesRange?.min || 0}
            max={ratesRange?.max || 500}
          />
        </FormControl>
      </Box>

      <RHFCheckboxGroup
        onFieldChange={handleMakeChange}
        name="make"
        fields={(makes || []).map(make => {
          const { _id, count } = make;
          return {
            name: `${_id} (${count})`,
            _id,
          };
        })}
        nameField="name"
        valueField="_id"
      />

      <RHFCheckboxGroup
        name="model"
        fields={(models || []).map(modelFacet => {
          const { _id, count } = modelFacet;
          return { name: `${_id} (${count})`, _id };
        })}
        nameField="name"
        valueField="_id"
      />

      <RHFCheckboxGroup
        name="type"
        fields={(types || []).map(typeFacet => {
          const { _id, count } = typeFacet;
          return { name: `${_id} (${count})`, _id };
        })}
        nameField="name"
        valueField="_id"
      />
      <RHFCheckboxGroup
        name="color"
        fields={(colors || []).map(colorFacet => {
          const { _id, count } = colorFacet;
          return { name: `${_id} (${count})`, _id };
        })}
        nameField="name"
        valueField="_id"
      />
    </Box>
  );
}

export const VehiclesFiltersPropTypes = {
  facets: PropTypes.object,
};

VehiclesFiltersFormFields.propTypes = {
  ...VehiclesFiltersPropTypes,
};

export default VehiclesFiltersFormFields;
