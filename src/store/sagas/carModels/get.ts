import { put, takeLatest, select, call } from 'redux-saga/effects';
import { doc, getDoc } from 'firebase/firestore';

//
import { GET_CAR_MODELS } from '../../actions/carModelsActions';
import { dbCollections } from '../../../utils/firebase';
//
import { start, carModelsSuccess, fail } from '../../slices/carModelsSlice';
import { error as toastError } from '../../slices/toastSlice';

//
import { ICarModel, RootState } from 'types';
//
type ICarModels = Record<string, ICarModel>;

function* getCarModel() {
  yield put(start(GET_CAR_MODELS));

  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  async function get() {
    const orgDetailsCollectionRef = dbCollections(orgId).orgDetails;
    const carModelsRef = doc(orgDetailsCollectionRef);

    const snap = await getDoc(carModelsRef);

    if (!snap.exists) {
      throw new Error('Car models not found!');
    }

    return {
      ...(snap.data() as ICarModels),
    };
  }

  try {
    const carModels: ICarModels = yield call(get);

    yield put(carModelsSuccess(carModels));
  } catch (err) {
    const error = err as Error;
    console.error(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* takeGetCarModel() {
  yield takeLatest(GET_CAR_MODELS, getCarModel);
}
