import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { GET_PAYMENT_TERMS } from "../../../store/actions/paymentTermsActions";

import Stepper from "../../../components/ui/Stepper";

import SkeletonLoader from "../../../components/ui/SkeletonLoader";
import Empty from "../../../components/ui/Empty";

import DetailsForm from "../../../components/forms/Vendors/DetailsForm";
import ExtraDetailsForm from "../../../components/forms/Vendors/ExtraDetailsForm";
import AddressForm from "../../../components/forms/Vendors/AddressForm";

function EditVendor(props) {
  const {
    vendor,
    loading,
    saveData,
    getPaymentTerms,
    loadingPaymentTerms,
    paymentTerms,
  } = props;
  const [formValues, setFormValues] = useState(vendor || {});

  useEffect(() => {
    getPaymentTerms();
  }, [getPaymentTerms]);

  function updateFormValues(data) {
    setFormValues((current) => ({ ...current, ...data }));
  }

  function finish(data) {
    updateFormValues(data);

    saveData({
      ...formValues,
      ...data,
    });
  }

  console.log({ paymentTerms });

  return loadingPaymentTerms ? (
    <SkeletonLoader />
  ) : paymentTerms?.length > 0 ? (
    <Stepper
      steps={[
        {
          label: "Details",
          content: (
            <DetailsForm
              handleFormSubmit={updateFormValues}
              defaultValues={formValues}
              loading={loading}
            />
          ),
        },
        {
          label: "Address",
          content: (
            <AddressForm
              handleFormSubmit={updateFormValues}
              loading={loading}
              defaultValues={formValues}
            />
          ),
        },
        {
          label: "Extras",
          content: (
            <ExtraDetailsForm
              handleFormSubmit={finish}
              loading={loading}
              defaultValues={formValues}
              updateFormValues={updateFormValues}
              paymentTerms={paymentTerms}
              vendorId={vendor?.vendorId || ""}
            />
          ),
        },
      ]}
    />
  ) : (
    <Empty message="Payment Terms not found! Try to reload the page!" />
  );
}

EditVendor.propTypes = {
  loading: PropTypes.bool.isRequired,
  saveData: PropTypes.func.isRequired,
  vendor: PropTypes.shape({
    status: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    companyName: PropTypes.string,
    displayName: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    mobile: PropTypes.string,
    billingStreet: PropTypes.string,
    billingCity: PropTypes.string,
    billingState: PropTypes.string,
    billingPostalCode: PropTypes.string,
    billingCountry: PropTypes.string,
    shippingStreet: PropTypes.string,
    shippingCity: PropTypes.string,
    shippingState: PropTypes.string,
    shippingPostalCode: PropTypes.string,
    shippingCountry: PropTypes.string,
    website: PropTypes.string,
    paymentTermId: PropTypes.string,
    remarks: PropTypes.string,
  }),
};

function mapStateToProps(state) {
  const { loading, action, paymentTerms } = state.paymentTermsReducer;
  const loadingPaymentTerms = loading && action === GET_PAYMENT_TERMS;

  return { loadingPaymentTerms, paymentTerms };
}

function mapDispatchToProps(dispatch) {
  return {
    getPaymentTerms: () => dispatch({ type: GET_PAYMENT_TERMS }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditVendor);
