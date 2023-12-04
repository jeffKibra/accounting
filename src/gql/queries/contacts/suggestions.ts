import { gql } from '@apollo/client';

const contactFields = `
  _id
  companyName   
  firstName
  lastName
  displayName
  paymentTerm {
    days
    name
    _id
  }
`;

const GET_CONTACT_SUGGESTIONS = gql`
  query GetContactSuggestions($query: ID, $contactGroup:String ) {
    getContactSuggestions(query: $query, contactGroup: $contactGroup) {
        ${contactFields}
        searchScore
    }
  }
`;

export default GET_CONTACT_SUGGESTIONS;
