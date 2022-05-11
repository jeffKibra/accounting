import { createContext } from "react";

const initialState = {
  nextStep: () => {},
  prevStep: () => {},
};

const StepperContext = createContext({ ...initialState });
StepperContext.displayName = "stepper_context";

export default StepperContext;
