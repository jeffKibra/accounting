import { useEffect } from "react";
import { connect } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { RiCloseLine } from "react-icons/ri";
import { IconButton } from "@chakra-ui/react";

import useSavedLocation from "../../../hooks/useSavedLocation";
import { VENDORS } from "../../../nav/routes";
import {
  GET_VENDOR,
  UPDATE_VENDOR,
} from "../../../store/actions/vendorsActions";
import { reset } from "../../../store/slices/vendorsSlice";

import SkeletonLoader from "../../../components/ui/SkeletonLoader";
import Empty from "../../../components/ui/Empty";
import PageLayout from "../../../components/layout/PageLayout";
import EditVendor from "../../../containers/Management/Vendors/EditVendor";

function EditVendorPage(props) {
  const {
    loading,
    action,
    isModified,
    vendor,
    getVendor,
    updateVendor,
    resetVendor,
  } = props;
  const navigate = useNavigate();
  const { vendorId } = useParams();

  useSavedLocation().setLocation();

  useEffect(() => {
    getVendor(vendorId);
  }, [getVendor, vendorId]);

  useEffect(() => {
    if (isModified) {
      resetVendor();
      navigate(VENDORS);
    }
  }, [isModified, resetVendor, navigate]);

  function update(data) {
    updateVendor({ ...data, vendorId });
  }

  return (
    <PageLayout
      pageTitle="Edit vendor"
      actions={
        <Link to={VENDORS}>
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
      {loading && action === GET_VENDOR ? (
        <SkeletonLoader />
      ) : vendor ? (
        (() => {
          const { createdAt, createdBy, modifiedAt, modifiedBy, ...rest } =
            vendor;
          return (
            <EditVendor
              vendor={rest}
              loading={loading && action === UPDATE_VENDOR}
              saveData={update}
            />
          );
        })()
      ) : (
        <Empty message="vendor not Found!" />
      )}
    </PageLayout>
  );
}

function mapStateToProps(state) {
  const { loading, action, isModified, vendor } = state.vendorsReducer;

  return { loading, action, isModified, vendor };
}

function mapDispatchToProps(dispatch) {
  return {
    getVendor: (vendorId) => dispatch({ type: GET_VENDOR, payload: vendorId }),
    updateVendor: (payload) => dispatch({ type: UPDATE_VENDOR, payload }),
    resetVendor: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditVendorPage);
