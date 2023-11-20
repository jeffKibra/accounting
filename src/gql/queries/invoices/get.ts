import { gql } from '@apollo/client';

export const invoiceFields = `
  _id
  items {
    itemId
    name
    description
    rate
    qty
    total
    salesAccountId
    details {
      taxType
      selectedDates
      startDate
      endDate
      item {
         _id
        registration
        model {
          make
          model
        } 
        year 
      }
    }
  }
  customer {
    _id
    displayName
  }
  saleDate
  taxType
  discount
  taxes
  totalTax
  subTotal
  total

  customerNotes
  dueDate

  paymentTerm{
    name
    value
    days
  } 
`;

const GET_INVOICE = gql`
  query GetBooking($id: ID) {
    booking(id: $id) {
     ${invoiceFields}
    }
  }
`;

export default GET_INVOICE;
