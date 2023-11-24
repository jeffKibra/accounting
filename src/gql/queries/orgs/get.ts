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

const GET_ORG = gql`
  query GetOrg($id: ID) {
    org(id: $id) {
     ${orgFields}
    }
  }
`;

export default GET_ORG;
