import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Box } from '@chakra-ui/react';

import { GET_SALE_RECEIPTS } from '../../../store/actions/saleReceiptsActions';
import { reset } from '../../../store/slices/saleReceiptsSlice';

import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import Empty from '../../../components/ui/Empty';

import SaleReceiptsTable from '../../../components/tables/SaleReceipts/SaleReceiptsTable';

function SaleReceipts(props) {
  const {
    loading,
    saleReceipts,
    action,
    isModified,
    getSaleReceipts,
    resetSaleReceipt,
  } = props;

  useEffect(() => {
    getSaleReceipts();
  }, [getSaleReceipts]);

  useEffect(() => {
    if (isModified) {
      resetSaleReceipt();
      getSaleReceipts();
    }
  }, [isModified, resetSaleReceipt, getSaleReceipts]);

  return loading && action === GET_SALE_RECEIPTS ? (
    <SkeletonLoader />
  ) : saleReceipts?.length > 0 ? (
    <Box
      mt={-2}
      w="full"
      bg="white"
      borderRadius="md"
      shadow="md"
      py={4}
      px={2}
    >
      <SaleReceiptsTable showCustomer saleReceipts={saleReceipts} />
    </Box>
  ) : (
    <Empty />
  );
}

function mapStateToProps(state) {
  const { loading, saleReceipts, action, isModified } =
    state.saleReceiptsReducer;

  return { loading, saleReceipts, action, isModified };
}

function mapDispatchToProps(dispatch) {
  return {
    getSaleReceipts: () => dispatch({ type: GET_SALE_RECEIPTS }),
    resetSaleReceipt: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SaleReceipts);
