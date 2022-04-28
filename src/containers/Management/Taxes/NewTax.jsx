import { useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import { TAXES } from "../../../nav/routes";

import { CREATE_TAX } from "../../../store/actions/taxesActions";
import { reset } from "../../../store/slices/taxesSlice";

import TaxForm from "../../../components/forms/Tax/TaxForm";

function NewTax(props) {
  const { loading, action, isModified, createTax, resetTax } = props;
  const navigate = useNavigate();

  useEffect(() => {
    if (isModified) {
      resetTax();
      navigate(TAXES);
    }
  }, [isModified, resetTax, navigate]);

  return (
    <TaxForm
      handleFormSubmit={createTax}
      loading={loading && action === CREATE_TAX}
    />
  );
}

function mapStateToProps(state) {
  const { loading, action, isModified } = state.taxesReducer;

  return { loading, action, isModified };
}

function mapDispatchToProps(dispatch) {
  return {
    createTax: (data) => dispatch({ type: CREATE_TAX, data }),
    resetTax: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewTax);
