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
import {
  watchUpdateCustomer,
  watchDeleteCustomer,
} from "./customers/updateCustomerSagas";
import {
  watchGetCustomer,
  watchGetCustomers,
} from "./customers/getCustomersSagas";
//invoices
import { watchCreateInvoice } from "./invoices/createInvoiceSagas";
import { watchGetInvoice, watchGetInvoices } from "./invoices/getInvoicesSagas";
import {
  watchUpdateInvoice,
  watchDeleteInvoice,
} from "./invoices/updateInvoiceSagas";
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
    watchUpdateInvoice(),
    watchDeleteInvoice(),
    watchCreateItemCategory(),
  ]);
}
