export default function generateQueryOptions(state, additionalQueryParams) {
  // console.log({ state });
  const {
    sortBy,
    hitsPerPage,
    // valueToSearch,
    filters,
    pageIndex: incomingPage,
  } = state;
  // console.log({ incomingPage });

  const pageNumberIsValid =
    !isNaN(incomingPage) &&
    typeof incomingPage === 'number' &&
    incomingPage >= 0;

  // const sortByField = sortBy?.field || 'searchScore';

  // const sortByFieldIsNumeric =
  //   sortByField === 'searchScore' || sortByField === 'rate';
  // console.log({ sortByField, sortByFieldIsNumeric });

  const sortByIsValid =
    Array.isArray(sortBy) &&
    sortBy.length === 2 &&
    Boolean(sortBy[0]) &&
    Boolean(sortBy[1]);

  const additionalQueryParamsIsValid =
    additionalQueryParams && typeof additionalQueryParams === 'object';

  // console.log({ sortByIsValid, sortBy });

  const queryOptions = {
    pagination: {
      limit: hitsPerPage,
      page: pageNumberIsValid ? incomingPage : 0,
    },
    filters: {
      ...filters,
      // make:"Toyota"
      // color: ['grey'],
      // make:["Honda"]
      // type:["sedan"]
      // rate:[20000, 40000]
      // make:["Mercedes"]
    },
    ...(sortByIsValid
      ? {
          sortBy,
        }
      : {}),
    ...(additionalQueryParamsIsValid ? { ...additionalQueryParams } : {}),
  };

  localStorage.setItem('listQueryOptions', JSON.stringify(queryOptions));

  // console.log({ queryOptions });

  return queryOptions;
}
