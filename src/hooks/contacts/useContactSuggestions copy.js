// import { useEffect, useState, useCallback } from 'react';

// import { useQuery } from '@apollo/client';
// //
// import { queries } from 'gql';
// import useToasts from '../useToasts';

// function useContactSuggestions(contactGroup) {
//   const [page, setPage] = useState(0);
//   const [query, setQuery] = useState('');
//   const [allSuggestions, setAllSuggestions]=useState([])

//   const [refetching, setRefetching] = useState(false);

//   const createVariables=useCallback((incomingQuery="", incomingPage=0)=>{
//     return {query:incomingQuery, page:incomingPage, group:contactGroup}
//   }, [contactGroup])

//   const { loading, error, data, refetch } = useQuery(
//     queries.contacts.GET_CONTACT_SUGGESTIONS,
//     {
//       variables: createVariables("", 0),
//       skip:true,//skipping initial fetch
//     }
//   );

//   const fetchSuggestions = useCallback(
//     async (incomingQuery, incomingPage) => {
//       setRefetching(true);

//       try {
//         const variables=createVariables(incomingQuery, incomingPage)
//         const result = await refetch(variables);
//         console.log({result})

//         const data=result?.data||{}
//         const incomingSuggestions=data?.suggestions||[]
//         const meta=data?.meta||{}

//         setAllSuggestions((current)=>{
//           if(incomingPage===0){
//             return incomingSuggestions
//           }else{
//             return [...current, ]
//           }
//         })
        

//         return result;
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setRefetching(false);
//       }
//     },
//     [refetch, createVariables]
//   );

//   const handleQueryChange = useCallback(
//     incomingQuery => {
//       setQuery(incomingQuery)
//       //reset suggestions
//       setAllSuggestions([])
//       //
//       fetchSuggestions(incomingQuery, 0);
//     },
//     [fetchSuggestions]
//   );

//   const loadMore = useCallback(() => {
//     let currentQuery = '';
//     let incomingPage = 0;

//     setPage(current => {
//       const incoming = +current + 1;
//       incomingPage = incoming;

//       return incoming;
//     });
//     setQuery(current => {
//       currentQuery = current;
//       return current;
//     });

//     fetchSuggestions(currentQuery, incomingPage);
//   }, [setPage, setQuery, fetchSuggestions]);

//   const { error: toastError } = useToasts();

//   const failed = !loading && Boolean(error);

//   useEffect(()=>{
//     fetchSuggestions()
//   }, [fetchSuggestions])

//   useEffect(() => {
//     if (failed) {
//       toastError(error?.message || 'Unknown error!');
//     }
//   }, [failed, error, toastError]);

//   const suggestions = data?.suggestions;
//   const hasMore = data?.meta?.hasMore || false;
//   const loadingMore=

//   return { loading, error, suggestions, hasMore, fetchSuggestions: refetch };
// }

// export default useContactSuggestions;
