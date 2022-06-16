import { useReducer } from "react";
import PropTypes from "prop-types";
import { Step, Steps, useSteps } from "chakra-ui-steps";

import {
  FormContext,
  reducer,
  actions,
} from "../../contexts/stepperFormContext";

function StepperForm(props) {
  const { steps, handleFormSubmit, defaultValues } = props;
  const [state, dispatch] = useReducer(reducer, defaultValues || {});

  const { activeStep, nextStep, prevStep } = useSteps({ initialStep: 0 });

  console.log({ defaultValues, state });

  function updateState(payload) {
    console.log({ payload });
    dispatch({ type: actions.UPDATE, payload });
  }

  function finish(extras) {
    updateState(extras);
    const data = {
      ...state,
      ...extras,
    };

    // console.log({ data });

    handleFormSubmit(data);
  }

  function next(data) {
    updateState(data);
    nextStep();
  }

  function prev(data) {
    updateState(data);
    prevStep();
  }

  return (
    <FormContext.Provider value={{ state, next, prev, finish, updateState }}>
      <Steps activeStep={activeStep}>
        {steps.map(({ label, content }, i) => {
          // console.log({ props, defaultValues, Content, label });
          return (
            <Step label={label} key={i}>
              {content}
            </Step>
          );
        })}
      </Steps>
    </FormContext.Provider>
  );
}

StepperForm.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node.isRequired,
      content: PropTypes.node.isRequired,
    })
  ),
  handleFormSubmit: PropTypes.func.isRequired,
  defaultValues: PropTypes.object,
};

export default StepperForm;
