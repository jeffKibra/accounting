function formatCustomerData(customer) {
  const { displayName, type, companyName, email, customerId } = customer;

  return { displayName, type, companyName, email, customerId };
}

function formatInvoices(invoices = [{}]) {
  return invoices.map((invoice) => {
    const { invoiceSlug, invoiceDate, dueDate, summary, status, invoiceId } =
      invoice;
    return { invoiceSlug, invoiceDate, dueDate, summary, status, invoiceId };
  });
}

function formatInvoicePayment(payment) {
  const {
    paymentDate,
    paymentSlug,
    reference,
    paymentMode,
    account,
    amount,
    paymentId,
  } = payment;

  return {
    paymentDate,
    paymentSlug,
    reference,
    paymentMode,
    account,
    amount,
    paymentId,
  };
}

function formatOrgData(org) {
  const { orgId, size, name } = org;

  return { orgId, size, name };
}

function formatTransactionDetails(details) {
  const {
    amount,
    account,
    customer,
    org,
    paidInvoices,
    paymentMode,
    paymentSlug,
    payments,
    reference,
    paymentId,
    paymentDate,
  } = details;
  return {
    amount,
    account,
    customer: formatCustomerData(customer),
    org: formatOrgData(org),
    paidInvoices: formatInvoices(paidInvoices),
    paymentMode,
    paymentSlug,
    payments,
    reference,
    paymentDate,
    paymentId,
  };
}

const formats = {
  formatInvoices,
  formatInvoicePayment,
  formatCustomerData,
  formatOrgData,
  formatTransactionDetails,
};

export default formats;
