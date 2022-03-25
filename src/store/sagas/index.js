import { all } from "redux-saga/effects";

import { watchAuthListener, watchLogout, watchLogin } from "./auth/authSagas";
import { watchCreateUser } from "./auth/createUserSagas";
import { watchUserOrgs } from "./auth/userOrgsSagas";
import { watchGetOrg, watchGetOrgs } from "./orgs/orgsSagas";
import { watchCreateOrg } from "./orgs/createOrgSagas";
import { watchUpdateOrg } from "./orgs/updateOrgSagas";

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
  ]);
}
