function formatCustomerData(customer) {
  const { displayName, type, companyName, email, customerId } = customer;

  return { displayName, type, companyName, email, customerId };
}

function formatInvoices(invoices = [{}]) {
  return invoices.map((invoice) => {
    const {
      invoiceSlug,
      invoiceDate,
      dueDate,
      summary,
      status,
      invoiceId,
      balance,
    } = invoice;
    return {
      invoiceSlug,
      invoiceDate,
      dueDate,
      summary,
      status,
      invoiceId,
      balance,
    };
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
    excess,
  } = details;
  return {
    amount,
    account,
    customer: formatCustomerData(customer),
    paidInvoices: formatInvoices(paidInvoices),
    paymentMode,
    paymentSlug,
    payments,
    reference,
    paymentDate,
    paymentId,
    excess,
    ...(org ? { org: formatOrgData(org) } : {}),
  };
}

function formatInvoiceItems(items = []) {
  return items.map((item) => {
    const {
      createdAt,
      createdBy,
      modifiedBy,
      modifiedAt,
      itemDescription,
      sellingDetails,
      status,
      salesAccountId,
      salesTaxId,
      ...rest
    } = item;

    return { ...rest };
  });
}

const formats = {
  formatInvoices,
  formatInvoicePayment,
  formatCustomerData,
  formatOrgData,
  formatTransactionDetails,
  formatInvoiceItems,
};

export default formats;
