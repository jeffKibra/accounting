import { useEffect } from "react";
import { connect } from "react-redux";

import { GET_VENDORS } from "../../../store/actions/vendorsActions";
import { reset } from "../../../store/slices/vendorsSlice";

import Empty from "../../../components/ui/Empty";
import SkeletonLoader from "../../../components/ui/SkeletonLoader";

import VendorsTable from "../../../components/tables/Vendors/VendorsTable";

function Vendors(props) {
  const { loading, action, vendors, isModified, getVendor, resetVendor } =
    props;

  useEffect(() => {
    getVendor();
  }, [getVendor]);

  useEffect(() => {
    if (isModified) {
      resetVendor();
      getVendor();
    }
  }, [isModified, resetVendor, getVendor]);

  return loading && action === GET_VENDORS ? (
    <SkeletonLoader />
  ) : vendors?.length > 0 ? (
    <VendorsTable vendors={vendors} />
  ) : (
    <Empty message="Vendors not found!" />
  );
}

function mapStateToProps(state) {
  const { loading, action, vendors, isModified } = state.vendorsReducer;

  return { loading, action, vendors, isModified };
}

function mapDispatchToProps(dispatch) {
  return {
    getVendor: () => dispatch({ type: GET_VENDORS }),
    resetVendor: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Vendors);
