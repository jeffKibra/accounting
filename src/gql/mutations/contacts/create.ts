import { gql } from '@apollo/client';

const CREATE_CONTACT = gql`
  mutation CreateContact($contactGroup: String!, $formData: ContactInput!) {
    createContact(contactGroup: $contactGroup, formData: $formData)
  }
`;

// const CREATE_CONTACT = gql`
//   mutation CV($reg: String!) {
//     cv(reg: $reg)
//   }
// `;

export default CREATE_CONTACT;
