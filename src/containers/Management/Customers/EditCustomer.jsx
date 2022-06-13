import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { GET_PAYMENT_TERMS } from "../../../store/actions/paymentTermsActions";

import Stepper from "../../../components/ui/Stepper";

import SkeletonLoader from "../../../components/ui/SkeletonLoader";
import Empty from "../../../components/ui/Empty";

import DetailsForm from "../../../components/forms/CustomerForms/DetailsForm";
import ExtraDetailsForm from "../../../components/forms/CustomerForms/ExtraDetailsForm";
import AddressForm from "../../../components/forms/CustomerForms/AddressForm";

function EditCustomer(props) {
  const {
    customer,
    loading,
    saveData,
    getPaymentTerms,
    loadingPaymentTerms,
    paymentTerms,
  } = props;
  const [formValues, setFormValues] = useState(customer || {});

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
            />
          ),
        },
      ]}
    />
  ) : (
    <Empty message="Payment Terms not found! Try to reload the page!" />
  );
}

EditCustomer.propTypes = {
  loading: PropTypes.bool.isRequired,
  saveData: PropTypes.func.isRequired,
  customer: PropTypes.shape({
    status: PropTypes.string,
    type: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    companyName: PropTypes.string,
    displayName: PropTypes.string,
    email: PropTypes.string,
    workPhone: PropTypes.string,
    mobile: PropTypes.string,
    openingBalance: PropTypes.number,
    city: PropTypes.string,
    zipcode: PropTypes.string,
    website: PropTypes.string,
    address: PropTypes.string,
    remarks: PropTypes.string,
  }),
};

function mapStateToProps(state) {
  const { loading, action, paymentTerms } = state.paymentTermsReducer;
  const loadingPaymentTerms = loading && action === GET_PAYMENT_TERMS;
  console.log({ paymentTerms });

  return { loadingPaymentTerms, paymentTerms };
}

function mapDispatchToProps(dispatch) {
  return {
    getPaymentTerms: () => dispatch({ type: GET_PAYMENT_TERMS }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCustomer);
