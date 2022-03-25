export const NEW_ITEM_START = "NEW_ITEM_START";
export const NEW_ITEM_SUCCESS = "NEW_ITEM_SUCCESS";
export const NEW_ITEM_FAIL = "NEW_ITEM_FAIL";
export const NEW_ITEM_RESET = "NEW_ITEM_RESET";

export function newItemStart() {
  return {
    type: NEW_ITEM_START,
  };
}

export function newItemSuccess() {
  return {
    type: NEW_ITEM_SUCCESS,
  };
}

export function newItemFail(error) {
  return {
    type: NEW_ITEM_FAIL,
    error,
  };
}

export function newItemReset() {
  return {
    type: NEW_ITEM_RESET,
  };
}
