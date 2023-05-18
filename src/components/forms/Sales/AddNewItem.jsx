import { Flex, Button } from '@chakra-ui/react';
import { RiAddLine } from 'react-icons/ri';
import PropTypes from 'prop-types';

//ui components
import SaleItemModalForm from './SaleItemModalForm';

//-----------------------------------------------------------------------------\
AddNewItem.propTypes = {
  loading: PropTypes.bool.isRequired,
  itemsObject: PropTypes.object.isRequired,
  taxesObject: PropTypes.object.isRequired,
  selectedItemsObject: PropTypes.object.isRequired,
  addItemToList: PropTypes.func.isRequired,
  // preSelectedItems: PropTypes.array,
};

export default function AddNewItem(props) {
  // console.log({ props });
  const { addItemToList, loading, ...formProps } = props;

  return (
    <SaleItemModalForm
      loading={loading}
      handleFormSubmit={addItemToList}
      defaultValues={{}}
      {...formProps}
    >
      {(openModal, triggerRef) => {
        return (
          <Flex w="full" justifyContent="flex-start">
            <Button
              onClick={openModal}
              size="sm"
              colorScheme="cyan"
              leftIcon={<RiAddLine />}
              disabled={loading}
              ref={triggerRef}
            >
              add item
            </Button>{' '}
          </Flex>
        );
      }}
    </SaleItemModalForm>
  );
}
