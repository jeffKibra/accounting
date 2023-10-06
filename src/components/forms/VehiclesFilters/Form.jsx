import { useEffect } from 'react';

import { useForm, FormProvider } from 'react-hook-form';
import PropTypes from 'prop-types';
//
//

import FormFields, { VehiclesFiltersPropTypes } from './FormFields';

function VehiclesFiltersForm(props) {
  /**
   * component must be wrapped in a react-hook-form FormProvider context
   */
  const { onSubmit, ...moreProps } = props;

  const formMethods = useForm();
  const { handleSubmit, watch } = formMethods;

  const selectedMakes = watch('makes');

  console.log({ selectedMakes });

  useEffect(() => {
    console.log('selected makes have changed', selectedMakes);
  }, [selectedMakes]);

  // console.log({ models, makesObject });

  function handleFormSubmit(data) {
    console.log({ data });
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <FormFields {...moreProps} />
      </form>
    </FormProvider>
  );
}

VehiclesFiltersForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  ...VehiclesFiltersPropTypes,
};

export default VehiclesFiltersForm;
