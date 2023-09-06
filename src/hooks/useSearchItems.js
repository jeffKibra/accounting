import { useContext } from 'react';
//
import SearchItemsContext from 'contexts/SearchItemsContext';

export default function useSearchItems() {
  const values = useContext(SearchItemsContext);

  return {
    values,
  };
}
