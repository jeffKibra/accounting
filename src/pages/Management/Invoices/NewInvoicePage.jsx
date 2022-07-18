import { useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { IconButton } from "@chakra-ui/react";
import { RiCloseLine } from "react-icons/ri";

import { INVOICES } from "../../../nav/routes";

import { CREATE_INVOICE } from "../../../store/actions/invoicesActions";
import { reset } from "../../../store/slices/invoicesSlice";

import useSavedLocation from "../../../hooks/useSavedLocation";

import PageLayout from "../../../components/layout/PageLayout";
import EditInvoice from "../../../containers/Management/Invoices/EditInvoice";

function NewInvoicePage(props) {
  const { loading, action, isModified, createInvoice, resetInvoice } = props;
  useSavedLocation().setLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isModified) {
      resetInvoice();
      navigate(INVOICES);
    }
  }, [isModified, resetInvoice, navigate]);

  return (
    <PageLayout
      pageTitle="New Invoice"
      actions={
        <Link to={INVOICES}>
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
      <EditInvoice
        updating={loading && action === CREATE_INVOICE}
        handleFormSubmit={createInvoice}
      />
    </PageLayout>
  );
}

function mapStateToProps(state) {
  const { loading, action, isModified } = state.invoicesReducer;

  return { loading, action, isModified };
}

function mapDispatchToProps(dispatch) {
  return {
    createInvoice: (payload) => dispatch({ type: CREATE_INVOICE, payload }),
    resetInvoice: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewInvoicePage);
