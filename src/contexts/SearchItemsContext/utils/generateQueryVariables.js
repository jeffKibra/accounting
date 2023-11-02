export default function generateQueryVariables(
  state,
  selectedDates,
  bookingId
) {
  const {
    sortBy,
    hitsPerPage,
    valueToSearch,
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
    ...(bookingId ? { bookingId } : {}),
    ...(selectedDates?.length > 0
      ? {
          selectedDates,
        }
      : {}),
    ...(sortByIsValid
      ? {
          sortBy,
        }
      : {}),
  };

  const variables = {
    query: valueToSearch,
    queryOptions,
  };

  localStorage.setItem('searchVehiclesVariables', JSON.stringify(variables));

  return variables;
}
