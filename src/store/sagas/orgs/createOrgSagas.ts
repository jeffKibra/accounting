import {
  collection,
  limit,
  where,
  getDocs,
  serverTimestamp,
  query,
  getDoc,
  doc,
  writeBatch,
} from 'firebase/firestore';
import { put, call, takeLatest, select } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';

import { db } from '../../../utils/firebase';
import Summary from 'utils/summaries/summary';
import {
  accounts,
  accountTypes,
  paymentTerms,
  paymentModes,
} from '../../../constants';

import { start, success, fail } from '../../slices/orgsSlice';
import { CREATE_ORG } from '../../actions/orgsActions';
import {
  success as toastSuccess,
  error as toastError,
} from '../../slices/toastSlice';

import { OrgFormData, Org, UserProfile } from '../../../types';

export function getOrg(userId: string) {
  // console.log("getting org", userId);

  const q = query(
    collection(db, 'organizations'),
    where('owner', '==', userId),
    where('status', 'in', ['onboarding', 'active', 'suspended']),
    limit(1)
  );

  return getDocs(q).then(snap => {
    if (snap.empty) {
      return null;
    }

    const orgDoc = snap.docs[0];

    return {
      ...orgDoc.data(),
      orgId: orgDoc.id,
    };
  });
}

function* createOrg(action: PayloadAction<OrgFormData>) {
  yield put(start(CREATE_ORG));
  console.log({ payload: action.payload });

  const userProfile: UserProfile = yield select(
    state => state.authReducer.userProfile
  );
  const { email, uid } = userProfile;

  async function saveData() {
    const orgRef = doc(collection(db, 'organizations'));
    const accountsRef = doc(db, orgRef.path, 'orgDetails', 'accounts');
    const accountTypesRef = doc(db, orgRef.path, 'orgDetails', 'accountTypes');
    const paymentModesRef = doc(db, orgRef.path, 'orgDetails', 'paymentModes');
    const paymentTermsRef = doc(db, orgRef.path, 'orgDetails', 'paymentTerms');

    const batch = writeBatch(db);

    const summary = {
      invoices: 0,
      payments: 0,
      items: 0,
      customers: 0,
      invoicesTotal: 0,
      paymentsTotal: 0,
      deletedInvoices: 0,
      deletedPayments: 0,
      paymentModes: Object.keys(paymentModes).reduce((modes, key) => {
        return { ...modes, [key]: 0 };
      }, {}),
      accounts: Object.keys(accounts).reduce((accountsSummary, key) => {
        return {
          ...accountsSummary,
          [key]: 0,
        };
      }, {}),
      createdAt: serverTimestamp(),
      createdBy: uid,
      modifiedAt: serverTimestamp(),
      modifiedBy: uid,
    };

    const summaryRef = Summary.createOrgRef(orgRef.id);
    batch.set(summaryRef, summary);

    batch.set(accountsRef, {
      ...accounts,
    });

    batch.set(accountTypesRef, {
      ...accountTypes,
    });

    batch.set(paymentModesRef, {
      ...paymentModes,
    });

    batch.set(paymentTermsRef, {
      ...paymentTerms,
    });

    batch.set(orgRef, {
      ...action.payload,
      status: 'active',
      createdBy: email,
      modifiedBy: email,
      owner: uid,
      createdAt: serverTimestamp(),
      modifiedAt: serverTimestamp(),
    });

    await batch.commit();

    const orgDoc = await getDoc(orgRef);

    return {
      ...orgDoc.data(),
      orgId: orgDoc.id,
      id: orgDoc.id,
    };
  }

  async function userHasOrg() {
    if (uid) {
      const org = await getOrg(uid);
      if (org) {
        throw new Error('This User already has a Company account!');
      }
    } else {
      throw new Error('Unknow error');
    }
  }

  try {
    yield call(userHasOrg);

    const org: Org = yield call(saveData);
    // console.log({ org });

    yield put(success(org));
    yield put(toastSuccess('Campany successfully created!'));
  } catch (error) {
    const err = error as Error;
    console.log(err);
    yield put(fail(err));
    yield put(toastError(err.message));
  }
}

export function* watchCreateOrg() {
  yield takeLatest(CREATE_ORG, createOrg);
}
