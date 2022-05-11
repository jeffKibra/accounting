import { createContext } from "react";

const initialState = {
  nextStep: () => {},
  prevStep: () => {},
};

const StepperContext = createContext({ ...initialState });
StepperContext.name = "stepper_context";

export default StepperContext;
