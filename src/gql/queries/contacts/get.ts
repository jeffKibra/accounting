import { gql } from '@apollo/client';

const addressFields = `
  city
  country
  postalCode
  state
  street
`;

export const contactFields = `
  _id
  type
  companyName
  salutation
  firstName
  lastName
  displayName
  email
  phone
  openingBalance
  website
  remarks
  paymentTerm {
    days
    name
  }
  billingAddress{
    ${addressFields}
  }
  shippingAddress{
    ${addressFields}
  }
`;

const GET_CONTACT = gql`
  query GetContact($id: ID!) {
    contact(id: $id) {
     ${contactFields}
    }
  }
`;

export default GET_CONTACT;
