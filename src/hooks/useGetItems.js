import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';

//
import { GET_ITEMS } from 'store/actions/itemsActions';

//
import useSearchItems from './useSearchItems';

function useGetItems(idsForItemsToExclude) {
  const dispatch = useDispatch();

  const searchItemParams = useSearchItems(idsForItemsToExclude);
  const { setValueToSearch, items, loading, error } = searchItemParams;

  // console.log({ loading, error, items });

  const fetchFromFirestore = useCallback(
    idsForItemsToExclude => {
      console.log('fetching from firestore...');
      dispatch({ type: GET_ITEMS, payload: { idsForItemsToExclude } });
    },
    [dispatch]
  );

  const getItems = useCallback(
    (valueToSearch, idsForItemsToExclude) => {
      // if (valueToSearch) {
      //   console.log('searching algolia...', valueToSearch);
      //   searchItems('');

      //   // searchItems(valueToSearch, idsForItemsToExclude);
      // } else {
      //   fetchFromFirestore(idsForItemsToExclude);
      // }
      setValueToSearch('');
      // fetchFromFirestore();
    },
    [setValueToSearch]
  );

  useEffect(() => {
    // fetchFromFirestore();
  }, [fetchFromFirestore]);

  // useEffect(() => {
  //   console.log('getItems fn has changed...', getItems);
  // }, [getItems]);

  return { ...searchItemParams, getItems, fetchFromFirestore };
}

export default useGetItems;
