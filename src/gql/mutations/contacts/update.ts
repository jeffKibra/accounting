import { gql } from '@apollo/client';
//
import { contactFields } from '../../queries/contacts/get';

const UPDATE_CONTACT = gql`
  mutation UpdateContact($id: ID!, $formData: ContactInput!) {
    updateContact(id: $id, formData: $formData) {
      ${contactFields}
    }
  }
`;

export default UPDATE_CONTACT;
