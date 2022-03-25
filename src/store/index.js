import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

import rootSaga from "./sagas";

import { authReducer } from "./slices/auth/authSlice";
import { orgsReducer } from "./slices/orgs/orgsSlice";
import { modifyOrgsReducer } from "./slices/orgs/modifyOrgsSlice";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    authReducer,
    orgsReducer,
    modifyOrgsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: true, serializableCheck: false }).concat(
      sagaMiddleware
    ),
});

sagaMiddleware.run(rootSaga);

export default store;
