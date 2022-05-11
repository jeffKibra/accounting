import { Step, Steps, useSteps } from "chakra-ui-steps";
import PropTypes from "prop-types";

import StepperContext from "../../contexts/StepperContext";

function Stepper(props) {
  const { steps } = props;
  const { activeStep, nextStep, prevStep } = useSteps({ initialStep: 0 });

  return (
    <StepperContext.Provider value={{ nextStep, prevStep }}>
      <Steps activeStep={activeStep}>
        {steps.map(({ label, content }, i) => {
          return (
            <Step label={label} key={i}>
              {content}
            </Step>
          );
        })}
      </Steps>
    </StepperContext.Provider>
  );
}

Stepper.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node.isRequired,
      content: PropTypes.node.isRequired,
    })
  ),
};

export default Stepper;
