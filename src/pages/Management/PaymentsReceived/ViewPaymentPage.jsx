import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { connect } from "react-redux";
import { Box, Text } from "@chakra-ui/react";

import {
  DELETE_INVOICE,
  GET_INVOICE,
} from "../../../store/actions/invoicesActions";
import { reset } from "../../../store/slices/invoicesSlice";

import { INVOICES } from "../../../nav/routes";

import useSavedLocation from "../../../hooks/useSavedLocation";
import PageLayout from "../../../components/layout/PageLayout";

import SkeletonLoader from "../../../components/ui/SkeletonLoader";
import Empty from "../../../components/ui/Empty";

import TableActions from "../../../components/tables/TableActions";

import ViewPayment from "../../../containers/Management/PaymentsReceived/ViewPayment";

function ViewPaymentPage(props) {
  const {
    loading,
    action,
    isModified,
    invoice,
    deleteInvoice,
    resetInvoice,
    getInvoice,
  } = props;
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  useSavedLocation().setLocation();

  useEffect(() => {
    getInvoice(invoiceId);
  }, [getInvoice, invoiceId]);

  useEffect(() => {
    if (isModified) {
      resetInvoice();
      navigate(INVOICES);
    }
  }, [isModified, resetInvoice, navigate]);

  return (
    <PageLayout
      pageTitle={invoice?.invoiceSlug || "View Invoice"}
      actions={
        invoice && (
          <>
            <TableActions
              editRoute={`/invoices/${invoiceId}/edit`}
              deleteDialog={{
                isDeleted: isModified,
                loading: loading && action === DELETE_INVOICE,
                title: "Delete Invoice",
                onConfirm: () => deleteInvoice(invoiceId),
                message: (
                  <Box>
                    <Text>Are you sure you want to delete this Invoice</Text>
                    <Box p={1} pl={5}>
                      <Text>
                        Invoice#: <b>{invoice?.invoiceSlug}</b>
                      </Text>
                      <Text>
                        Customer Name: <b>{invoice?.customer?.displayName}</b>
                      </Text>
                      <Text>
                        Invoice Date : <b>{invoice?.invoiceDate}</b>
                      </Text>
                    </Box>
                    <Text>NOTE:::THIS ACTION CANNOT BE UNDONE!</Text>
                  </Box>
                ),
              }}
            />
          </>
        )
      }
    >
      {loading ? (
        <SkeletonLoader />
      ) : invoice ? (
        <ViewPayment invoice={invoice} />
      ) : (
        <Empty message="Invoice not found!" />
      )}
    </PageLayout>
  );
}

function mapStateToProps(state) {
  const { loading, action, isModified, invoice } = state.invoicesReducer;

  return { loading, action, isModified, invoice };
}

function mapDispatchToProps(dispatch) {
  return {
    deleteInvoice: (invoiceId) => dispatch({ type: DELETE_INVOICE, invoiceId }),
    resetInvoice: () => dispatch(reset()),
    getInvoice: (invoiceId) => dispatch({ type: GET_INVOICE, invoiceId }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewPaymentPage);
