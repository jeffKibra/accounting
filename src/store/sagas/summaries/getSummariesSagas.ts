import { put, call, select, takeLatest } from "redux-saga/effects";
import { getDocs, collection, query, orderBy, limit } from "firebase/firestore";
import { PayloadAction } from "@reduxjs/toolkit";

import { db } from "../../../utils/firebase";
import { GET_LATEST_SUMMARY } from "../../actions/summariesActions";
import { start, summarySuccess, fail } from "../../slices/summariesSlice";
import { error as toastError } from "../../slices/toastSlice";

import { RootState, DailySummary } from "../../../types";

function* getLatestSummary(action: PayloadAction) {
  yield put(start(action.type));
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  async function get() {
    const q = query(
      collection(db, "organizations", orgId, "summaries"),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) {
      return {};
    }

    const summaryDoc = snap.docs[0];

    return {
      ...summaryDoc.data(),
      summaryId: summaryDoc.id,
    };
  }

  try {
    const summary: DailySummary = yield call(get);
    console.log({ summary });

    yield put(summarySuccess(summary));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetLatestSummary() {
  yield takeLatest(GET_LATEST_SUMMARY, getLatestSummary);
}
