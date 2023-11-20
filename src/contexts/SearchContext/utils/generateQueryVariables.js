import { generateQueryOptions } from '../../ListContext/utils';

export default function generateQueryVariables(state, additionalQueryParams) {
  const queryOptions = generateQueryOptions(state, additionalQueryParams);
  const query = state.valueToSearch || '';

  const variables = {
    query,
    queryOptions,
  };

  localStorage.setItem('searchContextVariables', JSON.stringify(variables));

  return variables;
}
