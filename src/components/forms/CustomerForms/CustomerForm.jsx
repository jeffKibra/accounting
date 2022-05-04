// import { useState } from "react";
import PropTypes from "prop-types";

import DetailsForm from "./DetailsForm";
import ExtraDetailsForm from "./ExtraDetailsForm";

import StepperForm from "../../ui/StepperForm";

function CustomerForm(props) {
  const { loading, handleFormSubmit, customer } = props;

  return (
    <StepperForm
      defaultValues={customer}
      handleFormSubmit={handleFormSubmit}
      steps={[
        {
          label: "General Details",
          form: DetailsForm,
          props: { loading },
        },
        {
          label: "Extra Details",
          form: ExtraDetailsForm,
          props: { loading },
        },
      ]}
    />
  );
}

CustomerForm.propTypes = {
  loading: PropTypes.bool.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
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

export default CustomerForm;
