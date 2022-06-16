import { createContext } from "react";

export const actions = {
  UPDATE: "UPDATE",
};

const initialState = {
  finish: () => {},
  next: () => {},
  prev: () => {},
  updateState: () => {},
  state: {},
};

export function reducer(state, action) {
  console.log({ action });
  switch (action.type) {
    case actions.UPDATE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export const FormContext = createContext({ ...initialState });
FormContext.name = "stepper_form_context";
