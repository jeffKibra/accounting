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
  balance
  
  customerNotes
  dueDate

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
