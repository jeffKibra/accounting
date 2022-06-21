import { put, call, select, takeLatest } from "redux-saga/effects";
import {
  doc,
  getDocs,
  serverTimestamp,
  increment,
  runTransaction,
  collection,
  query,
  where,
  limit,
  orderBy,
} from "firebase/firestore";

import { db } from "../../../utils/firebase";
import { getDateDetails } from "../../../utils/dates";

import { DELETE_VENDOR } from "../../actions/vendorsActions";
import { start, success, fail } from "../../slices/vendorsSlice";
import {
  success as toastSuccess,
  error as toastError,
} from "../../slices/toastSlice";

function* deleteVendor({ vendorId }) {
  yield put(start(DELETE_VENDOR));

  const orgId = yield select((state) => state.orgsReducer.org.id);
  const userProfile = yield select((state) => state.authReducer.userProfile);
  const { email } = userProfile;

  async function update() {
    const vendorRef = doc(db, "organizations", orgId, "vendors", vendorId);
    const { yearMonthDay } = getDateDetails();
    const summaryRef = doc(
      db,
      "organizations",
      orgId,
      "summaries",
      yearMonthDay
    );

    async function allowDeletion() {
      const q = query(
        collection(db, "organizations", orgId, "journals"),
        orderBy("createdAt", "desc"),
        where("transactionDetails.vendorId", "==", vendorId),
        where("status", "==", "active"),
        limit(1)
      );

      const snap = await getDocs(q);
      const { size } = snap;
      console.log({ size });

      if (size > 0) {
        //deletion not allowed
        return false;
      } else {
        return true;
      }
    }

    const deleteAllowed = await allowDeletion();

    if (!deleteAllowed) {
      throw new Error(
        "This vendor has transactions associated with them and thus cannot be deleted! Try making them inactive!"
      );
    }

    await runTransaction(db, async (transaction) => {
      /**
       * update counters for one deleted vendor
       */
      transaction.update(summaryRef, {
        vendors: increment(-1),
      });
      /**
       * mark vendor as deleted
       */
      transaction.update(vendorRef, {
        status: "deleted",
        modifiedBy: email,
        modifiedAt: serverTimestamp(),
      });
    });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess("vendor Deleted successfully!"));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchDeleteVendor() {
  yield takeLatest(DELETE_VENDOR, deleteVendor);
}
