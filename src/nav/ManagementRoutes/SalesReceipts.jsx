import { Route } from 'react-router-dom';
import {
  SALES_RECEIPTS,
  NEW_SALES_RECEIPT,
  EDIT_SALES_RECEIPT,
  VIEW_SALES_RECEIPT,
} from '../routes';

import ManagementRoute from '../ManagementRoute';

//sales Receipts
import SalesReceiptsPage from '../../pages/Management/SalesReceipts/SalesReceiptsPage';
import NewSaleReceiptPage from '../../pages/Management/SalesReceipts/NewSaleReceiptPage';
import EditSaleReceiptPage from '../../pages/Management/SalesReceipts/EditSaleReceiptPage';
import ViewSaleReceiptPage from '../../pages/Management/SalesReceipts/ViewSaleReceiptPage';

function SalesReceipts() {
  return [
    <Route
      path={SALES_RECEIPTS}
      key={SALES_RECEIPTS}
      exact
      element={
        <ManagementRoute>
          <SalesReceiptsPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={NEW_SALES_RECEIPT}
      key={NEW_SALES_RECEIPT}
      exact
      element={
        <ManagementRoute>
          <NewSaleReceiptPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={EDIT_SALES_RECEIPT}
      key={EDIT_SALES_RECEIPT}
      exact
      element={
        <ManagementRoute>
          <EditSaleReceiptPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={VIEW_SALES_RECEIPT}
      key={VIEW_SALES_RECEIPT}
      exact
      element={
        <ManagementRoute>
          <ViewSaleReceiptPage />
        </ManagementRoute>
      }
    />,
  ];
}

export default SalesReceipts;
