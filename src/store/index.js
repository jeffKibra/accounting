import { configureStore, combineReducers } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

import { reset as authReset } from "./slices/authSlice";
import rootSaga from "./sagas";

import { toastReducer } from "./slices/toastSlice";
import { authReducer } from "./slices/authSlice";
import { orgsReducer } from "./slices/orgsSlice";
import { itemsReducer } from "./slices/itemsSlice";
import { taxesReducer } from "./slices/taxesSlice";
import { customersReducer } from "./slices/customersSlice";
import { invoicesReducer } from "./slices/invoicesSlice";
import { modifyItemsCategoriesReducer } from "./slices/itemsCategories/modifyItemsCategoriesSlice";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: (state, action) => {
    const appReducer = combineReducers({
      toastReducer,
      authReducer,
      orgsReducer,
      itemsReducer,
      taxesReducer,
      customersReducer,
      invoicesReducer,
      modifyItemsCategoriesReducer,
    });

    if (action.type === authReset().type) {
      return appReducer(undefined, action);
    }

    return appReducer(state, action);
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: true, serializableCheck: false }).concat(
      sagaMiddleware
    ),
});

sagaMiddleware.run(rootSaga);

export default store;
