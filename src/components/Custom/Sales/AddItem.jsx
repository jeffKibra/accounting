import { IconButton } from '@chakra-ui/react';
import { RiAddLine } from 'react-icons/ri';
import PropTypes from 'prop-types';

import SelectItemForm from '../../forms/Sales/ItemFields';
import CustomModal from '../../ui/CustomModal';

function AddItem(props) {
  const { addItem, items, loading } = props;

  return (
    <CustomModal
      title="Add Item"
      closeOnOverlayClick={false}
      renderTrigger={onOpen => (
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
      renderContent={onClose => {
        return (
          <SelectItemForm
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
  loading: PropTypes.bool.isRequired,
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
