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
export const ESTIMATES = '/estimates';
//invoices
export const INVOICES = '/invoices';
export const NEW_INVOICE = '/invoices/new';
export const EDIT_INVOICE = '/invoices/:invoiceId/edit';
export const VIEW_INVOICE = '/invoices/:invoiceId/view';
//payments received
export const PAYMENTS = '/payments';
export const NEW_PAYMENT = '/payments/new';
export const EDIT_PAYMENT = '/payments/:paymentId/edit';
export const VIEW_PAYMENT = '/payments/:paymentId/view';
//receipts
export const SALES_RECEIPTS = '/sales-receipts';
export const NEW_SALES_RECEIPT = '/sales-receipts/new';
export const EDIT_SALES_RECEIPT = '/sales-receipts/:salesReceiptId/edit';
export const VIEW_SALES_RECEIPT = '/sales-receipts/:salesReceiptId/view';
//vendors
export const VENDORS = '/vendors';
export const NEW_VENDOR = '/vendors/new';
export const EDIT_VENDOR = '/vendors/:vendorId/edit';
//expenses
export const EXPENSES = '/expenses';
export const NEW_EXPENSE = '/expenses/new';
export const EDIT_EXPENSE = '/expenses/:expenseId/edit';
export const VIEW_EXPENSE = '/expenses/:expenseId/view';

//book keeping
//chart of accounts
export const CHART_OF_ACCOUNTS = '/chart-of-accounts';


//settings
//taxes
export const TAXES = '/settings/taxes';
export const NEW_TAX = '/settings/taxes/new';
export const EDIT_TAX = '/settings/taxes/:taxId/edit';
//items categories
export const ITEMS_CATEGORIES = '/settings/itemsCategories';
export const NEW_ITEM_CATEGORY = '/settings/itemsCategories/new';
export const EDIT_ITEM_CATEGORY = '/settings/itemsCategories/:categoryId/edit';
