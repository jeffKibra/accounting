import { useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { IconButton } from "@chakra-ui/react";
import { RiCloseLine } from "react-icons/ri";

import { VENDORS } from "../../../nav/routes";

import { CREATE_VENDOR } from "../../../store/actions/vendorsActions";
import { reset } from "../../../store/slices/vendorsSlice";

import PageLayout from "../../../components/layout/PageLayout";

import useSavedLocation from "../../../hooks/useSavedLocation";

import EditVendor from "../../../containers/Management/Vendors/EditVendor";

function NewVendorPage(props) {
  const { loading, action, isModified, createVendor, resetVendor } = props;
  const navigate = useNavigate();

  useSavedLocation().setLocation();

  useEffect(() => {
    if (isModified) {
      resetVendor();
      navigate(VENDORS);
    }
  }, [isModified, resetVendor, navigate]);

  return (
    <PageLayout
      pageTitle="New Vendor"
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
      <EditVendor
        loading={loading && action === CREATE_VENDOR}
        saveData={createVendor}
      />
    </PageLayout>
  );
}

function mapStateToProps(state) {
  const { loading, action, isModified } = state.vendorsReducer;
  console.log({ loading, action });

  return { loading, action, isModified };
}

function mapDispatchToProps(dispatch) {
  return {
    createVendor: (data) => dispatch({ type: CREATE_VENDOR, data }),
    resetVendor: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewVendorPage);
