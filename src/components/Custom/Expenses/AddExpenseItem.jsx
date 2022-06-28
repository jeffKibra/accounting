import { IconButton } from "@chakra-ui/react";
import { RiAddLine } from "react-icons/ri";
import PropTypes from "prop-types";

import ExpenseItemDetailsForm from "../../forms/Expenses/ExpenseItemDetailsForm";
import CustomModal from "../../ui/CustomModal";

function AddExpenseItem(props) {
  const { addItem, loading } = props;

  return (
    <CustomModal
      title="Add Expense"
      closeOnOverlayClick={false}
      renderTrigger={(onOpen) => (
        <IconButton
          onClick={onOpen}
          colorScheme="cyan"
          icon={<RiAddLine />}
          borderRadius="full"
          position="fixed"
          bottom="50px"
          right="30px"
          zIndex="banner"
          title="add item"
          isDisabled={loading}
        />
      )}
      renderContent={(onClose) => {
        return (
          <ExpenseItemDetailsForm
            handleFormSubmit={addItem}
            onClose={onClose}
          />
        );
      }}
    />
  );
}

AddExpenseItem.propTypes = {
  addItem: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default AddExpenseItem;
