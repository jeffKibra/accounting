import CustomerOptions from 'containers/Management/Customers/CustomerOptions';

//

export default function getCustomerTableData(customer) {
  return {
    ...customer,
    receivables: 0,
    actions: <CustomerOptions customer={customer} edit view deletion />,
  };
}
