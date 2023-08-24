import React from 'react';
import { Flex, Button, Box } from '@chakra-ui/react';

//
import CustomModal from 'components/ui/CustomModal';

//
import SelectItem from './SelectItem';
import BookingDaysSelector from './BookingDaysSelector';

function ItemSelectorModal(props) {
  const { children } = props;

  return (
    <CustomModal
      size="xl"
      closeOnOverlayClick={false}
      title="Select a Vehicle to continue..."
      renderTrigger={children}
      renderContent={onClose => {
        return (
          <>
            <Box bg="#f4f6f8" mx={-6} mt={-6} px={4} pt={4} mb={4}>
              <BookingDaysSelector isEditing />
            </Box>

            <SelectItem onSelect={onClose} />
          </>
        );
      }}
      renderFooter={onClose => {
        return (
          <Flex justify="flex-end">
            <Button colorScheme="red" onClick={onClose}>
              Cancel
            </Button>
          </Flex>
        );
      }}
    />
  );
}

export default ItemSelectorModal;
