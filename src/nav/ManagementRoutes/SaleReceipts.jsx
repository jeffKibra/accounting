import { Route } from 'react-router-dom';
import {
  SALE_RECEIPTS,
  NEW_SALE_RECEIPT,
  EDIT_SALE_RECEIPT,
  VIEW_SALE_RECEIPT,
} from '../routes';

import ManagementRoute from '../ManagementRoute';

//sales Receipts
import SaleReceiptsPage from '../../pages/Management/SaleReceipts/SaleReceiptsPage';
import NewSaleReceiptPage from '../../pages/Management/SaleReceipts/NewSaleReceiptPage';
import EditSaleReceiptPage from '../../pages/Management/SaleReceipts/EditSaleReceiptPage';
import ViewSaleReceiptPage from '../../pages/Management/SaleReceipts/ViewSaleReceiptPage';

function SaleReceipts() {
  return [
    <Route
      path={SALE_RECEIPTS}
      key={SALE_RECEIPTS}
      exact
      element={
        <ManagementRoute>
          <SaleReceiptsPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={NEW_SALE_RECEIPT}
      key={NEW_SALE_RECEIPT}
      exact
      element={
        <ManagementRoute>
          <NewSaleReceiptPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={EDIT_SALE_RECEIPT}
      key={EDIT_SALE_RECEIPT}
      exact
      element={
        <ManagementRoute>
          <EditSaleReceiptPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={VIEW_SALE_RECEIPT}
      key={VIEW_SALE_RECEIPT}
      exact
      element={
        <ManagementRoute>
          <ViewSaleReceiptPage />
        </ManagementRoute>
      }
    />,
  ];
}

export default SaleReceipts;
