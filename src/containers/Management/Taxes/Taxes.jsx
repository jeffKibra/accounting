import { useEffect } from "react";
import { connect } from "react-redux";

import { GET_TAXES, DELETE_TAX } from "../../../store/actions/taxesActions";
import { reset } from "../../../store/slices/taxesSlice";

import SkeletonLoader from "../../../components/ui/SkeletonLoader";
import Empty from "../../../components/ui/Empty";

import TaxesTable from "../../../components/tables/Tax/TaxesTable";

function Taxes(props) {
  const { loading, action, taxes, isModified, getTaxes, deleteTax, resetTax } =
    props;

  useEffect(() => {
    getTaxes();
  }, [getTaxes]);

  useEffect(() => {
    if (isModified) {
      resetTax();
      getTaxes();
    }
  }, [isModified, resetTax, getTaxes]);

  return loading && action === GET_TAXES ? (
    <SkeletonLoader />
  ) : taxes && taxes.length > 0 ? (
    <TaxesTable
      deleting={loading && action === DELETE_TAX}
      isDeleted={isModified}
      handleDelete={deleteTax}
      taxes={taxes}
    />
  ) : (
    <Empty message="Taxes not found!" />
  );
}

function mapStateToProps(state) {
  const { loading, action, taxes, isModified } = state.taxesReducer;

  return { loading, action, taxes, isModified };
}

function mapDispatchToProps(dispatch) {
  return {
    getTaxes: () => dispatch({ type: GET_TAXES }),
    deleteTax: (taxId) => dispatch({ type: DELETE_TAX, taxId }),
    resetTax: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Taxes);
