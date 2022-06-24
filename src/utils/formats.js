function formatCustomerData(customer) {
  const { displayName, type, companyName, email, customerId } = customer;

  return customer?.customerId
    ? { displayName, type, companyName, email, customerId }
    : customer;
}

function formatVendorData(vendor) {
  const { displayName, companyName, email, vendorId } = vendor;

  return vendor?.vendorId
    ? { displayName, companyName, email, vendorId }
    : vendor;
}

function formatInvoices(invoices = [{}]) {
  return invoices.map((invoice) => {
    const {
      invoiceDate,
      dueDate,
      summary,
      status,
      invoiceId,
      balance,
      transactionType,
    } = invoice;
    return {
      invoiceDate,
      dueDate,
      summary,
      status,
      invoiceId,
      balance,
      transactionType,
    };
  });
}

function formatInvoicePayment(payment) {
  const { paymentDate, reference, paymentMode, account, amount, paymentId } =
    payment;

  return {
    paymentDate,
    reference,
    paymentMode,
    account,
    amount,
    paymentId,
  };
}

function formatOrgData(org) {
  const { orgId, businessType, name } = org;

  return { orgId, businessType, name };
}

function formatTransactionDetails(details) {
  const { createdAt, createdBy, modifiedAt, modifiedBy, ...rest } = details;
  const { customer, org, paidInvoices } = rest;
  return {
    ...rest,
    customer: formatCustomerData(customer),
    paidInvoices: formatInvoices(paidInvoices),
    ...(org ? { org: formatOrgData(org) } : {}),
  };
}

function formatSaleItems(items = []) {
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

function formatExpenseItems(items = []) {
  return items.map((item) => {
    const {
      createdAt,
      createdBy,
      modifiedBy,
      modifiedAt,
      status,
      accountId,
      taxId,
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
  formatSaleItems,
  formatExpenseItems,
  formatVendorData,
};

export default formats;
