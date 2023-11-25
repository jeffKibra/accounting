import { gql } from '@apollo/client';
//
import { orgFields } from '../../queries/orgs/get';

const CREATE_ORG = gql`
  mutation CreateOrg($formData: OrgInput!) {
    createOrg(formData: $formData) {
        ${orgFields}
    }
  }
`;

export default CREATE_ORG;
