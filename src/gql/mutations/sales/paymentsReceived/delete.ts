import { gql } from '@apollo/client';

//
// import { vehicleInListFields } from '../../queries/vehicles/searchVehicles';

const DELETE_PAYMENT_RECEIVED = gql`
  mutation DeletePaymentReceived($id: ID!) {
    deletePaymentReceived(id: $id)
  }
`;

export default DELETE_PAYMENT_RECEIVED;
