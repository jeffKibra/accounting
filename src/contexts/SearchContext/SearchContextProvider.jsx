import { useCallback, useContext } from 'react';
import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
//

import ListContext, { ListContextProvider } from '../ListContext';
//
import SearchContext from './Context';
//
import { generateQueryVariables } from './utils';

//----------------------------------------------------------------

export default function SearchContextProvider(props) {
  const { children, ...providerProps } = props;
  const { additionalQueryParams } = providerProps;

  const generateQueryVariablesCB = useCallback(
    stateToParse => {
      console.log('Search context provider geerateQueryVariables running...', {
        stateToParse,
        additionalQueryParams,
      });

      return generateQueryVariables(stateToParse, additionalQueryParams);
    },
    [additionalQueryParams]
  );

  return (
    <ListContextProvider
      {...providerProps}
      generateQueryVariables={generateQueryVariablesCB}
    >
      <ContextProvider {...props}>{children}</ContextProvider>
    </ListContextProvider>
  );
}

SearchContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  defaultValues: PropTypes.object,
  additionalQueryParams: PropTypes.object,
  GQLQuery: PropTypes.object.isRequired,
  resultField: PropTypes.string.isRequired,
};
//----------------------------------------------------------------
//----------------------------------------------------------------
ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

function ContextProvider(props) {
  // console.log({ props });
  const { children } = props;

  const listContextValues = useContext(ListContext);

  const { watch, control, setValue, refetchQuery } = listContextValues;

  //----------------------------------------------------------------
  //----------------------------------------------------------------

  const setValueToSearch = useCallback(
    inValue => {
      setValue('valueToSearch', inValue);
      //reset page index
      setValue('pageIndex', 0);
      //search
      refetchQuery();
    },
    [setValue, refetchQuery]
  );

  //----------------------------------------------------------------
  //----------------------------------------------------------------
  const valueToSearch = watch('valueToSearch');
  //----------------------------------------------------------------
  //----------------------------------------------------------------

  return (
    <>
      <SearchContext.Provider
        value={{
          ...listContextValues,
          //
          valueToSearch,
          setValueToSearch,
        }}
      >
        <Controller
          name="valueToSearch"
          control={control}
          render={() => null}
        />

        {children}
      </SearchContext.Provider>
    </>
  );
}
