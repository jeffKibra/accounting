import { useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { IconButton } from "@chakra-ui/react";
import { RiCloseLine } from "react-icons/ri";

import { SALES_RECEIPTS } from "../../../nav/routes";

import { CREATE_SALES_RECEIPT } from "../../../store/actions/salesReceiptsActions";
import { reset } from "../../../store/slices/salesReceiptsSlice";

import useSavedLocation from "../../../hooks/useSavedLocation";

import PageLayout from "../../../components/layout/PageLayout";
import SalesReceipts from "../../../containers/Management/SalesReceipts/EditSalesReceipt";

function NewSalesReceiptPage(props) {
  const { loading, action, isModified, createReceipt, resetReceipt } = props;
  useSavedLocation().setLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isModified) {
      resetReceipt();
      navigate(SALES_RECEIPTS);
    }
  }, [isModified, resetReceipt, navigate]);

  return (
    <PageLayout
      pageTitle="New Sales Receipt"
      actions={
        <Link to={SALES_RECEIPTS}>
          <IconButton
            colorScheme="red"
            variant="outline"
            size="sm"
            title="cancel"
            icon={<RiCloseLine />}
          />
        </Link>
      }
    >
      <SalesReceipts
        updating={loading && action === CREATE_SALES_RECEIPT}
        handleFormSubmit={createReceipt}
      />
    </PageLayout>
  );
}

function mapStateToProps(state) {
  const { loading, action, isModified } = state.salesReceiptsReducer;

  return { loading, action, isModified };
}

function mapDispatchToProps(dispatch) {
  return {
    createReceipt: (data) => dispatch({ type: CREATE_SALES_RECEIPT, data }),
    resetReceipt: () => dispatch(reset()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewSalesReceiptPage);
