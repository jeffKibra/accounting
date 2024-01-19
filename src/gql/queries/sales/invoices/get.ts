import { gql } from '@apollo/client';

export const invoiceFields = `
  _id
  items {
    itemId
    name
    description
    rate
    qty
    unit
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
        rate
        model {
          make
          name
          type
          year
        } 
        color
      }
    }
  }
  customer {
    _id
    displayName
  }
  customerNotes

  saleDate
  dueDate

  taxType
  discount
  taxes
  totalTax
  subTotal
  total
  balance

  paymentTerm{
    _id
    name
    days
  } 

  metaData {
    saleType
  }
`;

// payments{
//     paymentId
//     amount
//   }

const GET_INVOICE = gql`
  query GetInvoice($id: ID) {
    invoice(id: $id) {
     ${invoiceFields}
    }
  }
`;

export default GET_INVOICE;
