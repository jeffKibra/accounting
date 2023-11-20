import { generateQueryOptions } from '../../ListContext/utils';

export default function generateQueryVariables(
  valueToSearch,
  state,
  additionalQueryParams
) {
  const queryOptions = generateQueryOptions(state, additionalQueryParams);

  const variables = {
    query: valueToSearch,
    queryOptions,
  };

  localStorage.setItem('searchVehiclesVariables', JSON.stringify(variables));

  return variables;
}
