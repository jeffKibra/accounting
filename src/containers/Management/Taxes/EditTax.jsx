import { useEffect } from "react";
import { connect } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import { TAXES } from "../../../nav/routes";
import { GET_TAX, UPDATE_TAX } from "../../../store/actions/taxesActions";
import { reset } from "../../../store/slices/taxesSlice";

import SkeletonLoader from "../../../components/ui/SkeletonLoader";
import Empty from "../../../components/ui/Empty";

import TaxForm from "../../../components/forms/Tax/TaxForm";

function EditTax(props) {
  const { loading, tax, action, isModified, getTax, updateTax, resetTax } =
    props;
  const navigate = useNavigate();
  const { taxId } = useParams();

  useEffect(() => {
    getTax(taxId);
  }, [taxId, getTax]);

  useEffect(() => {
    if (isModified) {
      resetTax();
      navigate(TAXES);
    }
  }, [isModified, resetTax, navigate]);

  function handleFormSubmit(data) {
    updateTax({
      ...data,
      taxId,
    });
  }

  return loading && action === GET_TAX ? (
    <SkeletonLoader />
  ) : tax ? (
    <TaxForm
      handleFormSubmit={handleFormSubmit}
      loading={loading && action === UPDATE_TAX}
      tax={{
        name: tax.name,
        rate: tax.rate,
        taxId,
      }}
    />
  ) : (
    <Empty message="Tax Data not Found!" />
  );
}

function mapStateToProps(state) {
  const { loading, tax, action, isModified } = state.taxesReducer;

  return { loading, tax, action, isModified };
}

function mapDispatchToProps(dispatch) {
  return {
    getTax: (taxId) => dispatch({ type: GET_TAX, taxId }),
    updateTax: (data) => dispatch({ type: UPDATE_TAX, data }),
    resetTax: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditTax);
