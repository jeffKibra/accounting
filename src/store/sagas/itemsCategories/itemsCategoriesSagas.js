import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { call, put, takeLatest, select } from 'redux-saga/effects';

import { db } from '../../../utils/firebase';

import {
  start,
  categorySuccess,
  categoriesSuccess,
  fail,
} from '../../slices/itemsCategories/itemsCategoriesSlice';
import {
  GET_VEHICLE_CATEGORY,
  GET_VEHICLES_CATEGORIES,
} from '../../actions/itemsCategoriesActions';

function* getItemCategory({ categoryId }) {
  yield put(start());
  const userProfile = yield select(state => state.authReducer.userProfile);
  const orgId = userProfile.orgs[0]?.orgId;

  async function fetchOrg() {
    const categoryDoc = await getDoc(
      doc(db, 'organizations', orgId, 'itemsCategories', categoryId)
    );
    return categoryDoc.data();
  }

  try {
    const category = yield call(fetchOrg);

    yield put(categorySuccess(category));
  } catch (err) {
    console.log(err);
    yield put(fail(err));
  }
}

export function* watchGetItemCategory() {
  yield takeLatest(GET_VEHICLE_CATEGORY, getItemCategory);
}

function* getVehiclesCategories() {
  yield put(start());
  const userProfile = yield select(state => state.authReducer.userProfile);
  const orgId = userProfile.orgs[0]?.orgId;

  async function fetchOrgs() {
    const q = query(
      collection(db, 'organizations', orgId, 'itemsCategories'),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );
    const orgsSnap = await getDocs(q);
    const orgs = [];
    orgsSnap.forEach(doc => {
      orgs.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return orgs;
  }

  try {
    const orgs = yield call(fetchOrgs);

    yield put(categoriesSuccess(orgs));
  } catch (err) {
    console.log(err);
    yield put(fail(err));
  }
}

export function* watchGetVehiclesCategories() {
  yield takeLatest(GET_VEHICLES_CATEGORIES, getVehiclesCategories);
}
