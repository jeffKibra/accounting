import { useEffect } from "react";
import { connect } from "react-redux";

import SkeletonLoader from "../../ui/SkeletonLoader";

import { GET_TAXES } from "../../../store/actions/taxesActions";

import ItemFormComponent from "./ItemFormComponent";

function ItemForm(props) {
  const {
    loadingTaxes,
    taxesAction,
    taxes,
    getTaxes,
    handleFormSubmit,
    ...otherProps
  } = props;
  // console.log({ props });

  useEffect(() => {
    getTaxes();
  }, [getTaxes]);

  function handleSubmit(data) {
    // console.log({ data });
    const { taxId } = data;
    let tax = {};

    if (taxId) {
      const temp = taxes.find((tax) => tax.taxId === taxId);
      if (temp) {
        const { name, rate } = temp;
        tax = { name, rate, taxId };
      }
    }

    const newData = {
      ...data,
      tax,
    };
    // console.log({ newData });
    handleFormSubmit(newData);
  }

  return loadingTaxes && taxesAction === GET_TAXES ? (
    <SkeletonLoader />
  ) : (
    <ItemFormComponent
      handleFormSubmit={handleSubmit}
      taxes={taxes || []}
      {...otherProps}
    />
  );
}

function mapStateToProps(state) {
  const {
    loading: loadingTaxes,
    action: taxesAction,
    taxes,
  } = state.taxesReducer;

  return { loadingTaxes, taxesAction, taxes };
}

function mapDispatchToProps(dispatch) {
  return {
    getTaxes: () => dispatch({ type: GET_TAXES }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemForm);
