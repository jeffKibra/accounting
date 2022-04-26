import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

import rootSaga from "./sagas";

import { toastReducer } from "./slices/toastSlice";
import { authReducer } from "./slices/authSlice";
import { orgsReducer } from "./slices/orgsSlice";
import { itemsReducer } from "./slices/itemsSlice";
import { modifyItemsCategoriesReducer } from "./slices/itemsCategories/modifyItemsCategoriesSlice";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    toastReducer,
    authReducer,
    orgsReducer,
    itemsReducer,
    modifyItemsCategoriesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: true, serializableCheck: false }).concat(
      sagaMiddleware
    ),
});

sagaMiddleware.run(rootSaga);

export default store;
