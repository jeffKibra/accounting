import { all } from "redux-saga/effects";

import { watchAuthListener, watchLogout, watchLogin } from "./auth/authSagas";
import { watchCreateUser } from "./auth/createUserSagas";
//orgs
import { watchGetOrg, watchGetOrgs } from "./orgs/orgsSagas";
import { watchCreateOrg } from "./orgs/createOrgSagas";
import { watchUpdateOrg } from "./orgs/updateOrgSagas";
import { watchCheckOrg } from "./orgs/checkOrgSagas";
//items
import { watchCreateItem } from "./items/createItemSagas";
import { watchGetItem, watchGetItems } from "./items/getItemsSaga";
import { watchUpdateItem } from "./items/updateItemSagas";
import { watchDeleteItem } from "./items/updateItemSagas";
//taxes
import { watchCreateTax } from "./taxes/createTaxSagas";
import { watchGetTax, watchGetTaxes } from "./taxes/getTaxesSagas";
import { watchUpdateTax, watchDeleteTax } from "./taxes/updateTaxSagas";
//customers
import { watchCreateCustomer } from "./customers/createCustomerSagas";
import { watchUpdateCustomer } from "./customers/updateCustomerSagas";
import { watchDeleteCustomer } from "./customers/deleteCustomerSagas";
import {
  watchGetCustomer,
  watchGetCustomers,
} from "./customers/getCustomersSagas";
//invoices
import { watchCreateInvoice } from "./invoices/createInvoiceSagas";
import {
  watchGetInvoice,
  watchGetInvoices,
  watchGetCustomerInvoices,
  watchGetUnpaidCustomerInvoices,
  watchGetPaymentInvoicesToEdit,
} from "./invoices/getInvoicesSagas";
import { watchUpdateInvoice } from "./invoices/updateInvoiceSagas";
import { watchDeleteInvoice } from "./invoices/deleteInvoiceSagas";
//payments
import { watchCreatePayment } from "./payments/createPaymentSagas";
import {
  watchGetCustomerPayments,
  watchGetPayments,
  watchGetPayment,
} from "./payments/getPaymentsSagas";
import { watchUpdatePayment } from "./payments/updatePaymentSagas";
import { watchDeletePayment } from "./payments/deletePaymentSagas";
//accounts
import { watchGetAccounts } from "./accounts/getAccountsSagas";
import { watchCheckAccounts } from "./accounts/checkAccountsSagas";
//paymentModes
import { watchGetPaymentModes } from "./paymentModes/getPaymentModesSagas";
//paymentTerms
import { watchGetPaymentTerms } from "./paymentTerms/getPaymentTermsSagas";
//sales receipts
import { watchCreateSalesReceipt } from "./salesReceipts/createSalesReceiptSagas";
import {
  watchGetSalesReceipt,
  watchGetSalesReceipts,
  watchGetCustomerSalesReceipts,
} from "./salesReceipts/getSalesReceiptsSagas";
import { watchDeleteSalesReceipt } from "./salesReceipts/deleteSalesReceiptSagas";
import { watchUpdateSalesReceipt } from "./salesReceipts/updateSalesReceiptSagas";
//categories
import { watchCreateItemCategory } from "./itemsCategories/createItemCategorySagas";

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
    watchCreateInvoice(),
    watchGetInvoice(),
    watchGetInvoices(),
    watchGetCustomerInvoices(),
    watchGetUnpaidCustomerInvoices(),
    watchGetPaymentInvoicesToEdit(),
    watchUpdateInvoice(),
    watchDeleteInvoice(),
    watchCreatePayment(),
    watchGetCustomerPayments(),
    watchGetPayments(),
    watchGetPayment(),
    watchUpdatePayment(),
    watchDeletePayment(),
    watchGetAccounts(),
    watchCheckAccounts(),
    watchGetPaymentModes(),
    watchGetPaymentTerms(),
    watchCreateSalesReceipt(),
    watchGetSalesReceipt(),
    watchGetSalesReceipts(),
    watchGetCustomerSalesReceipts(),
    watchDeleteSalesReceipt(),
    watchUpdateSalesReceipt(),
    watchCreateItemCategory(),
  ]);
}
