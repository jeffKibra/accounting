import { Button } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import CustomModal from "../../ui/CustomModal";

import { reset } from "../../../store/slices/customersSlice";
import { UPDATE_CUSTOMER } from "../../../store/actions/customersActions";
import OpeningBalanceForm from "../../forms/Customers/OpeningBalanceForm";

function EditOpeningBalance(props) {
  const { renderTrigger, loading, ...rest } = props;

  return (
    <CustomModal
      title="Edit Opening Balance"
      closeOnOverlayClick={false}
      renderTrigger={
        renderTrigger ||
        function (onOpen) {
          return (
            <Button onClick={onOpen} isLoading={loading} size="sm">
              edit
            </Button>
          );
        }
      }
      renderContent={(onClose) => {
        return (
          <OpeningBalanceForm {...rest} loading={loading} onClose={onClose} />
        );
      }}
    />
  );
}

EditOpeningBalance.propTypes = {
  loading: PropTypes.bool.isRequired,
  openingBalance: PropTypes.number.isRequired,
  renderTrigger: PropTypes.func,
};

function mapStateToProps(state) {
  let { loading, action, isModified } = state.customersReducer;
  loading = loading && action === UPDATE_CUSTOMER;

  return { loading, isModified };
}

function mapDispatchToProps(dispatch) {
  return {
    resetCustomer: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditOpeningBalance);
