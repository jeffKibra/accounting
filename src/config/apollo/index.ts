import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
//
import { auth } from 'utils/firebase';

//
// 'https://cyan-good-calf.cyclic.app/graphql',
// 'http://localhost:5000/graphql'
const httpLink = createHttpLink({
  // uri: 'https://cyan-good-calf.cyclic.app/graphql',
  uri: 'http://localhost:5000/graphql',
  //   uri: '/graphql',
});

const authLink = setContext(async (_, { headers, ...moreParams }) => {
  console.log({ headers, ...moreParams, _ });
  /**
   * this is a middleware
   * it is invoked on every request
   */
  //   console.log('auth middleware running', { _, headers, moreParams });

  let token = '';

  const user = auth.currentUser;

  if (user) {
    token = await user.getIdToken();
  }
  //   console.log('token', token);
  //add orgId to headers from local storage
  const orgId = localStorage.getItem('orgId');
  // console.log({ orgId });
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'org-id': orgId,
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
