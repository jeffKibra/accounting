import { useSelector, useDispatch } from "react-redux";
import { Box, Text } from "@chakra-ui/react";

import { DELETE_EXPENSE } from "../store/actions/expensesActions";

import { reset } from "../store/slices/expenseSlice";

export default function useDeleteExpense(expense) {
  const { vendor, expenseId, expenseDate } = expense;
  const {
    loading,
    action,
    isModified: isDeleted,
  } = useSelector((state) => state.expensesReducer);
  const dispatch = useDispatch();

  const deleting = loading && action === DELETE_EXPENSE;

  function handleDelete() {
    dispatch({ type: DELETE_EXPENSE, payload: expenseId });
  }

  function resetExpense() {
    dispatch(reset());
  }

  const details = {
    isDone: isDeleted,
    title: "Delete Expense",
    onConfirm: () => handleDelete(expenseId),
    loading: deleting,
    message: (
      <Box>
        <Text>Are you sure you want to delete this Expense</Text>
        <Box p={1} pl={5}>
          <Text>
            Expense#: <b>{expenseId}</b>
          </Text>
          <Text>
            Vendor Name: <b>{vendor?.displayName}</b>
          </Text>
          <Text>
            Date :<b>{expenseDate.toDateString()}</b>
          </Text>
        </Box>
        <Text>NOTE:::THIS ACTION CANNOT BE UNDONE!</Text>
      </Box>
    ),
  };

  return {
    deleting,
    isDeleted,
    details,
    handleDelete,
    resetExpense,
  };
}
