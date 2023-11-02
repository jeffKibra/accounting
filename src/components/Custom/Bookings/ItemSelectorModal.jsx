import { useContext } from 'react';
import { Button, Box, HStack } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';
import { RiRestartLine, RiCloseLine } from 'react-icons/ri';

//
import BookingFormContext from 'contexts/BookingFormContext';
//
import CustomModal from 'components/ui/CustomModal';

//
import SelectItem from './SelectVehicle';
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

  const { watch, resetField } = useFormContext();
  const item = watch('item');
  const itemId = item?.itemId;

  const { savedData } = useContext(BookingFormContext);
  const savedItemId = savedData?.item?.itemId;

  const itemHasChanged = savedItemId ? savedItemId !== itemId : false;

  function resetSelectedItem() {
    resetField('item');
  }

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
          <HStack spacing={4} w="full" justifyContent="flex-end">
            {itemHasChanged ? (
              <Button
                rightIcon={<RiRestartLine />}
                type="button"
                colorScheme="cyan"
                onClick={() => {
                  resetSelectedItem();
                  onClose();
                }}
              >
                Reset Selected Item
              </Button>
            ) : null}

            <Button
              rightIcon={<RiCloseLine />}
              type="button"
              colorScheme="red"
              onClick={onClose}
            >
              Close
            </Button>
          </HStack>
        );
      }}
    />
  );
}

export default ItemSelectorModal;
