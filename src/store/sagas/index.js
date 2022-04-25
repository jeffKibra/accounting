import { all } from "redux-saga/effects";

import { watchAuthListener, watchLogout, watchLogin } from "./auth/authSagas";
import { watchCreateUser } from "./auth/createUserSagas";
//orgs
import { watchUserOrgs } from "./auth/userOrgsSagas";
import { watchGetOrg, watchGetOrgs } from "./orgs/orgsSagas";
import { watchCreateOrg } from "./orgs/createOrgSagas";
import { watchUpdateOrg } from "./orgs/updateOrgSagas";
import { watchCheckOrg } from "./orgs/checkOrgSagas";
//items
import { watchCreateItem } from "./items/createItemSagas";
import { watchGetItem, watchGetItems } from "./items/getItemsSaga";
import { watchUpdateItem } from "./items/updateItemSagas";
//categories
import { watchCreateItemCategory } from "./itemsCategories/createItemCategorySagas";

export default function* rootSaga() {
  yield all([
    watchAuthListener(),
    watchLogout(),
    watchLogin(),
    watchCreateUser(),
    watchUserOrgs(),
    watchGetOrg(),
    watchGetOrgs(),
    watchCreateOrg(),
    watchUpdateOrg(),
    watchCheckOrg(),
    watchCreateItem(),
    watchGetItem(),
    watchGetItems(),
    watchUpdateItem(),
    watchCreateItemCategory(),
  ]);
}
