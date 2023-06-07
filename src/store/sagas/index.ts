import { all } from 'redux-saga/effects';

import { watchAuthListener, watchLogout, watchLogin } from './auth/authSagas';
import { watchCreateUser } from './auth/createUserSagas';
//orgs
import { watchGetOrg, watchGetOrgs } from './orgs/orgsSagas';
import { watchCreateOrg } from './orgs/createOrgSagas';
import { watchUpdateOrg } from './orgs/updateOrgSagas';
import { watchCheckOrg } from './orgs/checkOrgSagas';
//items
import { watchCreateItem } from './items/createItemSagas';
import { watchGetItem, watchGetItems } from './items/getItemSaga';
import { watchUpdateItem } from './items/updateItemSagas';
import { watchDeleteItem } from './items/updateItemSagas';
//taxes
import { watchCreateTax } from './taxes/createTaxSagas';
import { watchGetTax, watchGetTaxes } from './taxes/getTaxesSagas';
import { watchUpdateTax, watchDeleteTax } from './taxes/updateTaxSagas';
//customers
import { watchCreateCustomer } from './customers/createCustomerSagas';
import { watchUpdateCustomer } from './customers/updateCustomerSagas';
import { watchDeleteCustomer } from './customers/deleteCustomerSagas';
import {
  watchGetCustomer,
  watchGetCustomers,
} from './customers/getCustomersSagas';
import { watchUpdateCustomerOpeningBalance } from './customers/updateOBSagas';
//invoices
import { watchCreateInvoice } from './invoices/createInvoiceSagas';
import {
  watchGetInvoice,
  watchGetInvoices,
  watchGetCustomerInvoices,
  watchGetCustomerUnpaidInvoices,
  watchGetPaymentInvoicesToEdit,
  watchGetPaymentInvoices,
} from './invoices/getInvoicesSagas';
import { watchUpdateInvoice } from './invoices/updateInvoiceSagas';
import { watchDeleteInvoice } from './invoices/deleteInvoiceSagas';
//payments
import { watchCreatePayment } from './payments/createPaymentSagas';
import {
  watchGetCustomerPayments,
  watchGetPayments,
  watchGetPayment,
} from './payments/getPaymentsSagas';
import { watchUpdatePayment } from './payments/updatePaymentSagas';
import { watchDeletePayment } from './payments/deletePaymentSagas';
//accounts
import { watchGetAccounts } from './accounts/getAccountsSagas';
import { watchCreateAccount } from './accounts/createAccountSagas';
import { watchChartOfAccountsGetList } from './accounts/getChartOfAccountsListSagas';
import { watchUpdateAccount } from './accounts/updateAccountSagas';
import { watchDeleteAccount } from './accounts/deleteAccountSagas';
//paymentModes
import { watchGetPaymentModes } from './paymentModes/getPaymentModesSagas';
//paymentTerms
import { watchGetPaymentTerms } from './paymentTerms/getPaymentTermsSagas';
//sales receipts
import { watchCreateSaleReceipt } from './saleReceipts/createSaleReceiptSagas';
import {
  watchGetSaleReceipt,
  watchGetSaleReceipts,
  watchGetCustomerSaleReceipts,
} from './saleReceipts/getSaleReceiptsSagas';
import { watchDeleteSaleReceipt } from './saleReceipts/deleteSaleReceiptSagas';
import { watchUpdateSaleReceipt } from './saleReceipts/updateSaleReceiptSagas';
//vendors
import { watchCreateVendor } from './vendors/createVendorSagas';
import { watchGetVendors, watchGetVendor } from './vendors/getVendorsSagas';
import { watchUpdateVendor } from './vendors/updateVendorSagas';
import { watchDeleteVendor } from './vendors/deleteVendorSagas';
//expenses
import { watchCreateExpense } from './expenses/createExpenseSagas';
import {
  watchGetExpense,
  watchGetExpenses,
  watchGetVendorExpenses,
} from './expenses/getExpensesSagas';
import { watchUpdateExpense } from './expenses/updateExpenseSagas';
import { watchDeleteExpense } from './expenses/deleteExpenseSagas';
//summaries
import { watchGetMainSummary } from './summaries/getSummariesSagas';
//accountTypes
import { watchFetchAccountTypes } from './accountTypes/fetchAccountTypesSagas';
//manual journals
import { watchCreateManualJournal } from './manualJournals/createManualJournalSagas';
//monthy bookings
import {
  watchGetMonthBookings,
  watchGetMonthlyBookings,
} from './monthlyBookings/get';
//categories
import { watchCreateItemCategory } from './itemsCategories/createItemCategorySagas';

export default function* rootSaga() {
  yield all([
    watchAuthListener(),
    watchLogout(),
    watchLogin(),
    watchCreateUser(),
    watchGetOrg(),
    watchGetOrgs(),
    watchCreateOrg(),
    watchUpdateOrg(),
    watchCheckOrg(),
    watchCreateItem(),
    watchGetItem(),
    watchGetItems(),
    watchUpdateItem(),
    watchDeleteItem(),
    watchCreateTax(),
    watchGetTax(),
    watchGetTaxes(),
    watchUpdateTax(),
    watchDeleteTax(),
    watchCreateCustomer(),
    watchUpdateCustomer(),
    watchDeleteCustomer(),
    watchGetCustomer(),
    watchGetCustomers(),
    watchUpdateCustomerOpeningBalance(),
    watchCreateInvoice(),
    watchGetInvoice(),
    watchGetInvoices(),
    watchGetCustomerInvoices(),
    watchGetCustomerUnpaidInvoices(),
    watchGetPaymentInvoicesToEdit(),
    watchGetPaymentInvoices(),
    watchUpdateInvoice(),
    watchDeleteInvoice(),
    watchCreatePayment(),
    watchGetCustomerPayments(),
    watchGetPayments(),
    watchGetPayment(),
    watchUpdatePayment(),
    watchDeletePayment(),
    watchCreateAccount(),
    watchChartOfAccountsGetList(),
    watchUpdateAccount(),
    watchDeleteAccount(),
    watchGetAccounts(),
    watchGetPaymentModes(),
    watchGetPaymentTerms(),
    watchCreateSaleReceipt(),
    watchGetSaleReceipt(),
    watchGetSaleReceipts(),
    watchGetCustomerSaleReceipts(),
    watchDeleteSaleReceipt(),
    watchUpdateSaleReceipt(),
    watchCreateVendor(),
    watchGetVendor(),
    watchGetVendors(),
    watchUpdateVendor(),
    watchDeleteVendor(),
    watchCreateExpense(),
    watchGetExpense(),
    watchGetExpenses(),
    watchGetVendorExpenses(),
    watchUpdateExpense(),
    watchDeleteExpense(),
    watchGetMainSummary(),
    watchFetchAccountTypes(),
    watchCreateManualJournal(),
    watchGetMonthBookings(),
    watchGetMonthlyBookings(),
    watchCreateItemCategory(),
  ]);
}
