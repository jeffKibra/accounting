import { Button } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import CustomModal from "../../ui/CustomModal";

import { reset } from "../../../store/slices/customersSlice";
import { UPDATE_OPENING_BALANCE } from "../../../store/actions/customersActions";
import OpeningBalanceForm from "../../forms/Customers/OpeningBalanceForm";

function EditOpeningBalance(props) {
  const {
    renderTrigger,
    updateOpeningBalance,
    loading,
    customerId,
    openingBalance,
    isModified,
    ...rest
  } = props;

  function handleFormSubmit(data) {
    updateOpeningBalance({ ...data, customerId });
  }

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
          <OpeningBalanceForm
            {...rest}
            handleFormSubmit={handleFormSubmit}
            isModified={isModified}
            openingBalance={openingBalance}
            loading={loading}
            onClose={onClose}
          />
        );
      }}
    />
  );
}

EditOpeningBalance.propTypes = {
  loading: PropTypes.bool.isRequired,
  customerId: PropTypes.string.isRequired,
  openingBalance: PropTypes.number.isRequired,
  renderTrigger: PropTypes.func,
};

function mapStateToProps(state) {
  let { loading, action, isModified } = state.customersReducer;
  loading = loading && action === UPDATE_OPENING_BALANCE;

  return { loading, isModified };
}

function mapDispatchToProps(dispatch) {
  return {
    updateOpeningBalance: (data) =>
      dispatch({ type: UPDATE_OPENING_BALANCE, data }),
    resetCustomer: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditOpeningBalance);
