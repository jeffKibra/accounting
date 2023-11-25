import {
  put,
  takeLatest,
  // select,
  call,
} from 'redux-saga/effects';
import { doc, setDoc } from 'firebase/firestore';
import { getBlob, ref } from 'firebase/storage';
import { PayloadAction } from '@reduxjs/toolkit';

//
import { GET_CAR_MODELS, GET_CAR_MODEL } from '../../actions/carModelsActions';
import { storage, db } from '../../../utils/firebase';
//
import {
  start,
  carMakesSuccess,
  carModelsSuccess,
  carModelSuccess,
  fail,
  carTypesSuccess,
} from '../../slices/carModelsSlice';
import { error as toastError } from '../../slices/toastSlice';
//
import { fileHandling } from 'utils/files';

//
import {
  ICarModel,
  ICarModels,
  //  RootState
} from 'types';
//

// const carModelsURL =
//   'https://firebasestorage.googleapis.com/v0/b/lehi-76a0d.appspot.com/o/carModels.json?alt=media&token=15d73a09-ae18-4451-8405-903445ec4ef7';

function getCarMakes(models: ICarModels) {
  const makes = Object.keys(models).sort();

  // console.log({ makes });

  return makes;
}

function getCarTypes(models: ICarModels) {
  const carTypes: Record<string, string> = {};

  if (models && typeof models === 'object') {
    Object.values(models).forEach(makeModels => {
      if (makeModels && typeof makeModels === 'object') {
        Object.values(makeModels).forEach(carModel => {
          const typesString = carModel?.type || '';
          // console.log({ typesString });

          String(typesString)
            .split(',')
            .forEach(type => {
              const carType = String(type).trim();

              if (carType) {
                carTypes[carType] = carType;
              }
            });
        });
      }
    });
  }

  // console.log({ carTypes });

  return Object.keys(carTypes);
}

async function getCarModelsFromFile() {
  const carModelsFileRef = ref(storage, 'carModels.json');
  const carModelsFileBlob = await getBlob(carModelsFileRef);
  // console.log({ carModelsFileBlob });
  const carModelsFileArrayBuffer = await carModelsFileBlob.arrayBuffer();
  // console.log({ carModelsFileArrayBuffer });

  // await fileHandling.downloadFile(
  //   carModelsFileArrayBuffer,
  //   'carModelsOriginal.json'
  // );
  const carModels = await fileHandling._readDataFromArrayBuffer(
    carModelsFileArrayBuffer
  );
  // console.log({ carModels });

  return carModels;
}

export async function copyCarModelsToDB() {
  const carModels = await getCarModelsFromFile();

  //firestore\
  const docRef = doc(db, 'global/carModels');
  await setDoc(
    docRef,
    {
      models: carModels,
    },
    { merge: true }
  );
}

async function getAllModels() {
  const carModels: ICarModels = await getCarModelsFromFile();

  // console.log({ carModels });

  return carModels;
}

function* getCarModel(action: PayloadAction<string>) {
  yield put(start(GET_CAR_MODEL));

  const modelId = action.payload;
  // console.log({ modelId });

  // const orgId: string = yield select(
  //   (state: RootState) => state.orgsReducer.org?._id
  // );

  async function get() {
    const allModels = await getAllModels();
    // console.log({ allModels });
    // const modelData = allModels[modelId];
    const modelData = allModels[0];
    // console.log({ modelData });

    return {
      ...modelData,
      id: modelId,
    };
  }

  try {
    const carModel: ICarModel = yield call(get);

    yield put(carModelSuccess(carModel));
  } catch (err) {
    const error = err as Error;
    console.error(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetCarModel() {
  yield takeLatest(GET_CAR_MODEL, getCarModel);
}

function* getCarModels() {
  yield put(start(GET_CAR_MODELS));

  try {
    const carModels: ICarModels = yield call(getAllModels);
    const carMakes = getCarMakes(carModels);
    const carTypes = getCarTypes(carModels);
    // console.log({ carTypes });

    yield put(carMakesSuccess(carMakes));
    yield put(carModelsSuccess(carModels));
    yield put(carTypesSuccess(carTypes));
  } catch (err) {
    const error = err as Error;
    console.error(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetCarModels() {
  yield takeLatest(GET_CAR_MODELS, getCarModels);
}

export function sortGroupedModelsYears(modelsGroupedByMake: ICarModels) {
  const modelsGroupedByMakeSorted = Object.keys(modelsGroupedByMake).reduce(
    (obj: ICarModels, make) => {
      const makeData = modelsGroupedByMake[make];

      const sortedModels = Object.keys(makeData).reduce(
        (acc: Record<string, ICarModel>, model) => {
          const modelData = makeData[model];
          const sortedYears = modelData.years.sort((a, b) => b - a);

          return {
            ...acc,
            [model]: {
              ...modelData,
              years: sortedYears,
            },
          };
        },
        {}
      );

      return {
        ...obj,
        [make]: sortedModels,
      };
    },
    {}
  );

  // console.log({ modelsGroupedByMakeSorted });

  //temp-create file
  // createCarModelsFile(modelsGroupedByMakeSorted); //returns promise
}

export async function createCarModelsFile(data: ICarModels) {
  const fileBuffer = await fileHandling._createBufferFromData(data);

  await fileHandling.downloadFile(fileBuffer, 'carModels.json');
}

// interface INewCarModel extends Omit<ICarModel, 'year'> {
//   years: number[];
// }
// async function getCarMakes(models: ICarModels) {
//   const sortedModels = models.sort((a, b) => {
//     if (a.model < b.model) return -1;
//     else if (a.model > b.model) return 1;
//     else return 0;
//   });

//   const modelsGroupedByMake = sortedModels.reduce(
//     (obj: Record<string, Record<string, INewCarModel>>, modelData) => {
//       const { year, id, ...rest } = modelData;
//       const { make, model } = rest;
//       const currentMakeData = obj[make] || {};
//       const currentModelData = currentMakeData[model] || rest;
//       const currentModelYears = currentModelData.years || [];

//       const incomingModelData: INewCarModel = {
//         ...currentModelData,
//         years: [...currentModelYears, year],
//       };
//       const incomingMakeData = {
//         ...currentMakeData,
//         [model]: incomingModelData,
//       };

//       return {
//         ...obj,
//         [make]: incomingMakeData,
//       };
//     },
//     {}
//   );

//   //sort years
// const modelsGroupedByMakeSorted = Object.keys(modelsGroupedByMake).reduce(
//   (obj: Record<string, Record<string, INewCarModel>>, make) => {
//     const makeData = modelsGroupedByMake[make];

//     const sortedModels = Object.keys(makeData).reduce(
//       (acc: Record<string, INewCarModel>, model) => {
//         const modelData = makeData[model];
//         const sortedYears = modelData.years.sort();

//         return {
//           ...acc,
//           [model]: {
//             ...modelData,
//             years: sortedYears,
//           },
//         };
//       },
//       {}
//     );

//     return {
//       ...obj,
//       [make]: sortedModels,
//     };
//   },
//   {}
// );

//   console.log({ modelsGroupedByMake, modelsGroupedByMakeSorted });

//   //create file
//   const fileBuffer = await fileHandling._createBufferFromData(
//     modelsGroupedByMakeSorted
//   );
//   await fileHandling.downloadFile(fileBuffer, 'carModels.json');

//   const makes = Object.keys(modelsGroupedByMake).sort();

//   console.log({ makes });

//   return { makes, modelsGroupedByMake: modelsGroupedByMake };
// }
