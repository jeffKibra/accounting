import { useState } from "react";
import PropTypes from "prop-types";

import DetailsForm from "./DetailsForm";
import ExtraDetailsForm from "./ExtraDetailsForm";

import Stepper from "../../ui/Stepper";

function CustomerForm(props) {
  const { loading, handleFormSubmit, customer } = props;

  const [formValues, setFormValues] = useState({ ...customer });

  function updateValues(data) {
    setFormValues((current) => {
      return {
        ...current,
        ...data,
      };
    });
  }

  function saveCustomer(extras) {
    updateValues(extras);
    const data = {
      ...formValues,
      ...extras,
    };

    // console.log({ data });

    handleFormSubmit(data);
  }

  return (
    <Stepper
      renderSteps={(prevStep, nextStep) => {
        return [
          {
            label: "General Details",
            content: (
              <DetailsForm
                details={formValues}
                handleFormSubmit={updateValues}
                loading={loading}
                next={nextStep}
              />
            ),
          },
          {
            label: "Extra Details",
            content: (
              <ExtraDetailsForm
                extraDetails={formValues}
                handleFormSubmit={saveCustomer}
                updateValues={updateValues}
                loading={loading}
                prev={prevStep}
              />
            ),
          },
        ];
      }}
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
