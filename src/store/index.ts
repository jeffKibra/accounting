import { configureStore, combineReducers } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import { reset as authReset } from './slices/authSlice';
import rootSaga from './sagas';

import { toastReducer } from './slices/toastSlice';
import { authReducer } from './slices/authSlice';
import { orgsReducer } from './slices/orgsSlice';
import { itemsReducer } from './slices/itemsSlice';
import { taxesReducer } from './slices/taxesSlice';
import { customersReducer } from './slices/customersSlice';
import { invoicesReducer } from './slices/invoicesSlice';
import { paymentsReducer } from './slices/paymentsSlice';
import { accountsReducer } from './slices/accountsSlice';
import { paymentTermsReducer } from './slices/paymentTermsSlice';
import { paymentModesReducer } from './slices/paymentModesSlice';
import { salesReceiptsReducer } from './slices/salesReceiptsSlice';
import { vendorsReducer } from './slices/vendorsSlice';
import { expensesReducer } from './slices/expenseSlice';
import { summariesReducer } from './slices/summariesSlice';
import { modifyItemsCategoriesReducer } from './slices/itemsCategories/modifyItemsCategoriesSlice';

const sagaMiddleware = createSagaMiddleware();

const appReducer = combineReducers({
  toastReducer,
  authReducer,
  orgsReducer,
  itemsReducer,
  taxesReducer,
  customersReducer,
  invoicesReducer,
  paymentsReducer,
  accountsReducer,
  paymentTermsReducer,
  paymentModesReducer,
  salesReceiptsReducer,
  vendorsReducer,
  expensesReducer,
  summariesReducer,
  modifyItemsCategoriesReducer,
});

const store = configureStore({
  reducer: (state, action) => {
    if (action.type === authReset().type) {
      return appReducer(undefined, action);
    }

    return appReducer(state, action);
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ thunk: true, serializableCheck: false }).concat(
      sagaMiddleware
    ),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof appReducer>;

export default store;
