import { useState } from "react";
import PropTypes from "prop-types";
import { Step, Steps, useSteps } from "chakra-ui-steps";

function StepperForm(props) {
  const { steps, handleFormSubmit, defaultValues } = props;

  const { activeStep, nextStep, prevStep } = useSteps({ initialStep: 0 });

  const [formValues, setFormValues] = useState(defaultValues || {});
  console.log({ defaultValues, formValues });
  function updateValues(data) {
    setFormValues((current) => {
      return {
        ...current,
        ...data,
      };
    });
  }

  function finish(extras) {
    updateValues(extras);
    const data = {
      ...formValues,
      ...extras,
    };

    // console.log({ data });

    handleFormSubmit(data);
  }

  function next(data) {
    updateValues(data);
    nextStep();
  }

  function prev(data) {
    updateValues(data);
    prevStep();
  }

  return (
    <Steps activeStep={activeStep}>
      {steps.map(({ label, form: Content, props }, i) => {
        // console.log({ props, defaultValues, Content, label });
        return (
          <Step label={label} key={i}>
            <Content
              {...props}
              defaultValues={formValues}
              prev={prev}
              handleFormSubmit={activeStep === steps.length - 1 ? finish : next}
            />
          </Step>
        );
      })}
    </Steps>
  );
}

StepperForm.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node.isRequired,
      form: PropTypes.func.isRequired,
      props: PropTypes.object,
    })
  ),
  handleFormSubmit: PropTypes.func.isRequired,
  defaultValues: PropTypes.object,
};

export default StepperForm;
