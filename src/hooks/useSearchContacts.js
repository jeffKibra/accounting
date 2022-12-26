import { useMemo, useState } from 'react';
import algoliasearch from 'algoliasearch';

const algoliaAppId = process.env.REACT_APP_ALGOLIA_APP_ID;
const alogoliaSearchApiKey = process.env.REACT_APP_ALGOLIA_SEARCH_API_KEY;

export default function useSearchContacts() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const hitsPerPage = 1;

  const index = useMemo(() => {
    const client = algoliasearch(algoliaAppId, alogoliaSearchApiKey);
    const index = client.initIndex('contacts');
    return index;
  }, []);

  function reset() {
    setResult(null);
    setError(null);
  }

  async function search(string, page) {
    try {
      reset();
      setIsLoading(true);

      const pageNumberIsValid =
        !isNaN(page) && typeof page === 'number' && page >= 0;
      //   console.log({ pageNumberIsValid, page });

      if (string) {
        const searchResult = await index.search(string, {
          hitsPerPage,
          ...(pageNumberIsValid ? { page } : {}),
        });
        // console.log({ searchResult });

        setResult(searchResult);
      }
    } catch (error) {
      console.error(error);
      setError(error);
    }
    setIsLoading(false);
  }

  const list = result?.hits || [];
  const fullListLength = result?.nbHits || 0;

  return {
    result,
    error,
    search,
    isLoading,
    list,
    fullListLength,
    hitsPerPage,
  };
}
