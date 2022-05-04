import { Step, Steps, useSteps } from "chakra-ui-steps";
import PropTypes from "prop-types";

function Stepper(props) {
  const { renderSteps } = props;
  const { activeStep, nextStep, prevStep } = useSteps({ initialStep: 0 });

  // console.log({ activeStep, ln: steps.length });
  const steps = renderSteps(prevStep, nextStep);

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

Stepper.propTypes = {
  renderSteps: PropTypes.func.isRequired,
};

export default Stepper;
