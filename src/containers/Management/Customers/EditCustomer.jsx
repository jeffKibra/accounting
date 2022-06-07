import { useState } from "react";
import PropTypes from "prop-types";

import Stepper from "../../../components/ui/Stepper";

import DetailsForm from "../../../components/forms/CustomerForms/DetailsForm";
import ExtraDetailsForm from "../../../components/forms/CustomerForms/ExtraDetailsForm";
import AddressForm from "../../../components/forms/CustomerForms/AddressForm";
function EditCustomer(props) {
  const { customer, loading, saveData } = props;
  const [formValues, setFormValues] = useState(customer || {});

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

  return (
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
              handleFormSubmit={finish}
              loading={loading}
              defaultValues={formValues}
              updateFormValues={updateFormValues}
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
            />
          ),
        },
      ]}
    />
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

export default EditCustomer;
