import { useFormContext, Controller } from 'react-hook-form';

function SearchVehiclesFormFields(props) {
  const { control } = useFormContext();

  return (
    <>
      <Controller name="query" control={control} render={() => null} />
      <Controller name="hitsPerPage" control={control} render={() => null} />
      <Controller name="pageIndex" control={control} render={() => null} />
      <Controller name="filters" control={control} render={() => null} />
    </>
  );
}

export default SearchVehiclesFormFields;
