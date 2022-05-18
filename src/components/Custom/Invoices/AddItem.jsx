import { IconButton } from "@chakra-ui/react";
import { RiAddLine } from "react-icons/ri";
import PropTypes from "prop-types";

import ItemQtyForm from "../../forms/Invoice/ItemQtyForm";
import CustomModal from "../../ui/CustomModal";

function AddItem(props) {
  const { addItem, items } = props;

  return (
    <CustomModal
      title="Add Item"
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
        />
      )}
      renderContent={(onClose) => {
        return (
          <ItemQtyForm
            handleFormSubmit={addItem}
            onClose={onClose}
            items={items || []}
          />
        );
      }}
    />
  );
}

AddItem.propTypes = {
  addItem: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      variant: PropTypes.string,
      itemId: PropTypes.string.isRequired,
      sellingPrice: PropTypes.number.isRequired,
      tax: PropTypes.PropTypes.shape({
        name: PropTypes.string,
        rate: PropTypes.number,
        taxId: PropTypes.string,
      }),
    })
  ).isRequired,
};

export default AddItem;
