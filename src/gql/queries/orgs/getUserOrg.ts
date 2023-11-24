import { gql } from '@apollo/client';

export const orgFields = `
   _id
  name
  taxes {
    name
    rate
    _id
  }
  paymentTerms {
    name
    days
    _id
  }
  paymentModes {
    name
    _id
  }
`;

const GET_USER_ORG = gql`
  query GetUserOrg {
    userOrg {
     ${orgFields}
    }
  }
`;

export default GET_USER_ORG;
