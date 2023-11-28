import { gql } from '@apollo/client';

import { contactFields } from './get';

export const contactInListFields = `
  ${contactFields}
`;

const SEARCH_CONTACTS = gql`
  query SearchContacts($query: ID, $queryOptions: ContactsQueryOptions) {
    searchContacts(query: $query, queryOptions: $queryOptions) {
      list {
        ${contactInListFields}
        searchScore
      }
      meta {
        count
        page
      }
    }
  }
`;

export default SEARCH_CONTACTS;
