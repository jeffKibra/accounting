//auth routes
export const LOGIN_USER = '/login';
export const LOGOUT_USER = '/logout';
export const SIGNUP = '/signup';

export const DASHBOARD = '/';

//admin routes
export const ADMIN_ORGS = '/admin/orgs';
export const ADMIN_NEW_ORG = '/admin/orgs/new';
export const ADMIN_EDIT_ORG = '/admin/orgs/:orgId/edit';

//management routes
//orgs
export const ORGS = '/orgs';
// export const NEW_ORG = "/orgs/new";
//items
export const ITEMS = '/items';
export const NEW_ITEM = '/items/new';
export const EDIT_ITEM = '/items/:itemId/edit';
//customers
export const CUSTOMERS = '/customers';
export const NEW_CUSTOMER = '/customers/new';
export const EDIT_CUSTOMER = '/customers/:customerId/edit';
export const VIEW_CUSTOMER = '/customers/:customerId/view';
//estimates
export const ESTIMATES = '/sale/estimates';
//invoices
export const INVOICES = '/sale/invoices';
export const NEW_INVOICE = '/sale/invoices/new';
export const EDIT_INVOICE = '/sale/invoices/:invoiceId/edit';
export const VIEW_INVOICE = '/sale/invoices/:invoiceId/view';
//payments received
export const PAYMENTS = '/sale/payments';
export const NEW_PAYMENT = '/sale/payments/new';
export const EDIT_PAYMENT = '/sale/payments/:paymentId/edit';
export const VIEW_PAYMENT = '/sale/payments/:paymentId/view';
//receipts
export const SALES_RECEIPTS = '/sale/sales-receipts';
export const NEW_SALES_RECEIPT = '/sale/sales-receipts/new';
export const EDIT_SALES_RECEIPT = '/sale/sales-receipts/:salesReceiptId/edit';
export const VIEW_SALES_RECEIPT = '/sale/sales-receipts/:salesReceiptId/view';
//vendors
export const VENDORS = '/purchase/vendors';
export const NEW_VENDOR = '/purchase/vendors/new';
export const EDIT_VENDOR = '/purchase/vendors/:vendorId/edit';
//expenses
export const EXPENSES = '/purchase/expenses';
export const NEW_EXPENSE = '/purchase/expenses/new';
export const EDIT_EXPENSE = '/purchase/expenses/:expenseId/edit';
export const VIEW_EXPENSE = '/purchase/expenses/:expenseId/view';

//book keeping
//chart of accounts
export const CHART_OF_ACCOUNTS = '/book-keeping/chart-of-accounts';
//manual journals
export const MANUAL_JOURNALS = '/book-keeping/manual-journals';
export const NEW_MANUAL_JOURNAL =
  '/book-keeping/manual-journals/:journalId/new';
export const EDIT_MANUAL_JOURNAL =
  '/book-keeping/manual-journals/:journalId/edit';

//settings
//taxes
export const TAXES = '/settings/taxes';
export const NEW_TAX = '/settings/taxes/new';
export const EDIT_TAX = '/settings/taxes/:taxId/edit';
//items categories
export const ITEMS_CATEGORIES = '/settings/itemsCategories';
export const NEW_ITEM_CATEGORY = '/settings/itemsCategories/new';
export const EDIT_ITEM_CATEGORY = '/settings/itemsCategories/:categoryId/edit';
