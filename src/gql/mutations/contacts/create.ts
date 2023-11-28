import { gql } from '@apollo/client';

const CREATE_CONTACT = gql`
  mutation CreateContact($formData: ContactInput!) {
    createContact(formData: $formData)
  }
`;

// const CREATE_CONTACT = gql`
//   mutation CV($reg: String!) {
//     cv(reg: $reg)
//   }
// `;

export default CREATE_CONTACT;
