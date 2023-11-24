import { gql } from '@apollo/client';

//
// import { vehicleInListFields } from '../../queries/vehicles/searchVehicles';

const DELETE_INVOICE = gql`
  mutation DeleteInvoice($id: ID!) {
    deleteInvoice(id: $id)
  }
`;

export default DELETE_INVOICE;
