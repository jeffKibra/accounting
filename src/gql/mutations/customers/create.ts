import { gql } from '@apollo/client';

const CREATE_CUSTOMER = gql`
  mutation CreateCustomer($formData: ContactInput!) {
    createCustomer(formData: $formData)
  }
`;

// const CREATE_CUSTOMER = gql`
//   mutation CV($reg: String!) {
//     cv(reg: $reg)
//   }
// `;

export default CREATE_CUSTOMER;
