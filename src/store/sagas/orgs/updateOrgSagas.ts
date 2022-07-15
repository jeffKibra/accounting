import { put, call, takeLatest, select } from "redux-saga/effects";
import { updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { PayloadAction } from "@reduxjs/toolkit";

import { db } from "../../../utils/firebase";
import { UPDATE_ORG } from "../../actions/orgsActions";
import { start, success, fail } from "../../slices/orgsSlice";
import {
  error as toastError,
  success as toastSuccess,
} from "../../slices/toastSlice";

import { RootState, OrgFormData, UserProfile } from "../../../types";

interface UpdateData extends OrgFormData {
  orgId: string;
}

function* updateOrg(action: PayloadAction<UpdateData>) {
  yield put(start(UPDATE_ORG));
  const userProfile: UserProfile = yield select(
    (state: RootState) => state.authReducer.userProfile
  );

  //   console.log({ data, userProfile });
  const { orgId, ...formData } = action.payload;

  function update() {
    return updateDoc(doc(db, "organizations", orgId), {
      ...formData,
      modifiedBy: userProfile?.email,
      modifiedAt: serverTimestamp(),
    });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess("Organization successfully updated!"));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchUpdateOrg() {
  yield takeLatest(UPDATE_ORG, updateOrg);
}
