import { useEffect, useState, useCallback } from 'react';

import { useQuery } from '@apollo/client';
//
import { queries } from 'gql';
import useToasts from '../useToasts';

function useContactSuggestions(contactGroup) {
  const [refetching, setRefetching] = useState(false);

  const createVariables = useCallback(
    (incomingQuery = '') => {
      return { query: incomingQuery, contactGroup };
    },
    [contactGroup]
  );

  const {
    loading: fetching,
    error,
    data,
    refetch,
  } = useQuery(queries.contacts.GET_CONTACT_SUGGESTIONS, {
    variables: createVariables('', 0),
  });

  const suggestions = data?.getContactSuggestions || [];

  // console.log({ suggestions });

  const fetchSuggestions = useCallback(
    async incomingQuery => {
      setRefetching(true);

      try {
        const variables = createVariables(incomingQuery);
        const result = await refetch(variables);
        // console.log({ result });

        return result;
      } catch (error) {
        console.error(error);
      } finally {
        setRefetching(false);
      }
    },
    [refetch, createVariables]
  );

  const { error: toastError } = useToasts();

  const loading = fetching || refetching;

  const failed = !loading && Boolean(error);

  useEffect(() => {
    if (failed) {
      toastError(error?.message || 'Unknown error!');
    }
  }, [failed, error, toastError]);

  return { loading, error, suggestions, fetchSuggestions };
}

export default useContactSuggestions;
