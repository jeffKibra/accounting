//auth routes
export const LOGIN_USER = "/login";
export const LOGOUT_USER = "/logout";
export const SIGNUP = "/signup";

export const DASHBOARD = "/";

//admin routes
export const ADMIN_ORGS = "/admin/orgs";
export const ADMIN_NEW_ORG = "/admin/orgs/new";
export const ADMIN_EDIT_ORG = "/admin/orgs/:orgId/edit";

//management routes
//orgs
export const ORGS = "/orgs";
export const NEW_ORG = "/orgs/new";
//items
export const ITEMS = "/items";
export const NEW_ITEM = "/items/new";
export const EDIT_ITEM = "/items/:itemId/edit";
//customers
export const CUSTOMERS = "/customers";
export const NEW_CUSTOMER = "/customers/new";
export const EDIT_CUSTOMER = "/customers/:customerId/edit";
//estimates
export const ESTIMATES = "/estimates";
//invoices
export const INVOICES = "/invoices";
//receipts
export const SALES_RECEIPTS = "/sales-receipts";
//expenses
export const EXPENSES = "/expenses";
export const NEW_EXPENSE = "/expenses/new";
export const EDIT_EXPENSE = "/expenses/:expenseId/edit";
//settings
//taxes
export const TAXES = "/settings/taxes";
export const NEW_TAX = "/settings/taxes/new";
export const EDIT_TAX = "/settings/taxes/:taxId/edit";
//items categories
export const ITEMS_CATEGORIES = "/settings/itemsCategories";
export const NEW_ITEM_CATEGORY = "/settings/itemsCategories/new";
export const EDIT_ITEM_CATEGORY = "/settings/itemsCategories/:categoryId/edit";
