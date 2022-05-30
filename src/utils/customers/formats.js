function formatCustomerData(customer) {
  const { displayName, type, companyName, email, customerId } = customer;

  return { displayName, type, companyName, email, customerId };
}

const formats = {
  formatCustomerData,
};

export default formats;
