import generateQueryOptions from './generateQueryOptions';

export default function generateQueryVariables(state, additionalQueryParams) {
  const queryOptions = generateQueryOptions(state, additionalQueryParams);

  const variables = {
    // query: valueToSearch,
    queryOptions,
  };

  localStorage.setItem('listContextVariables', JSON.stringify(variables));

  return variables;
}
