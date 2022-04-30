import { useState } from "react";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import PropTypes from "prop-types";

// import AddressForm from "./ExtraDetailsForm";
import DetailsForm from "./DetailsForm";
import ExtraDetailsForm from "./ExtraDetailsForm";

function CustomerForm(props) {
  const { loading, handleFormSubmit, customer } = props;
  const { activeStep, nextStep, prevStep } = useSteps({ initialStep: 0 });

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

  const steps = [
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
          loading={loading}
          prev={prevStep}
        />
      ),
    },
  ];

  // console.log({ activeStep, ln: steps.length });

  return (
    <Steps activeStep={activeStep}>
      {steps.map(({ label, content }, i) => {
        return (
          <Step label={label} key={i}>
            {content}
          </Step>
        );
      })}
    </Steps>
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
