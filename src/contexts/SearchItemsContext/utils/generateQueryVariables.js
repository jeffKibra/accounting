export default function generateQueryVariables(state, incomingPage) {
  const {
    sortBy,
    hitsPerPage,
    valueToSearch,
    // filters,
  } = state;

  const pageNumberIsValid =
    !isNaN(incomingPage) &&
    typeof incomingPage === 'number' &&
    incomingPage >= 0;

  const sortByField = sortBy?.field || 'searchScore';

  const sortByFieldIsNumeric =
    sortByField === 'searchScore' || sortByField === 'rate';
  console.log({ sortByField, sortByFieldIsNumeric });

  const queryOptions = {
    sortBy,
    pagination: {
      limit: hitsPerPage,
      page: pageNumberIsValid ? incomingPage : 0,
    },
    filters: {
      // make:"Toyota"
      // color: ['grey'],
      // make:["Honda"]
      // type:["sedan"]
      // rate:[20000, 40000]
      // make:["Mercedes"]
    },
  };

  return {
    query: valueToSearch,
    queryOptions,
  };
}
