import { createContext } from "react";

const initialState = {
  nextStep: () => {},
  prevStep: () => {},
  activeStep: 0,
  totalSteps: 0,
};

const StepperContext = createContext({ ...initialState });
StepperContext.displayName = "stepper_context";

export default StepperContext;
