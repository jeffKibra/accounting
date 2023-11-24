import { gql } from '@apollo/client';

const CREATE_ORG = gql`
  mutation CreateOrg($formData: OrgInput!) {
    createOrg(formData: $formData)
  }
`;

export default CREATE_ORG;
