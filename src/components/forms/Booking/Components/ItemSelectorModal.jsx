import { Flex, Button, Box } from '@chakra-ui/react';
import PropTypes from 'prop-types';

//
import CustomModal from 'components/ui/CustomModal';

//
import SelectItem from './SelectItem';
import BookingDaysSelector from './BookingDaysSelector';

//----------------------------------------------------------------
ItemSelectorModal.propTypes = {
  preselectedItemId: PropTypes.string,
  preselectedDates: PropTypes.array,
  children: PropTypes.func.isRequired,
};

ItemSelectorModal.defaultProps = {
  preselectedItemId: '',
  preselectedDates: [],
};

function ItemSelectorModal(props) {
  const { children, preselectedItemId, preselectedDates } = props;

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

            <SelectItem
              onSelect={onClose}
              preselectedItemId={preselectedItemId}
              preselectedDates={preselectedDates}
            />
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
