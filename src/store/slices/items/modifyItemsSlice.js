import {
  NEW_ITEM_START,
  NEW_ITEM_SUCCESS,
  NEW_ITEM_FAIL,
  NEW_ITEM_RESET,
} from "../../actions/items/newItemActions";

export const initialState = {
  loading: false,
  isCreated: false,
  error: null,
};

function start(state, action) {
  return {
    ...state,
    loading: true,
  };
}

function success(state, action) {
  return {
    ...state,
    loading: false,
    isCreated: true,
  };
}

function fail(state, action) {
  return {
    ...state,
    loading: false,
    error: action.error,
  };
}

function reset(state, action) {
  return {
    ...initialState,
  };
}

export default function newItemReducer(state, action) {
  console.log({ state, action });
  switch (action.type) {
    case NEW_ITEM_START:
      return start(state, action);
    case NEW_ITEM_SUCCESS:
      return success(state, action);
    case NEW_ITEM_FAIL:
      return fail(state, action);
    case NEW_ITEM_RESET:
      return reset(state, action);
    default:
      return state;
  }
}
