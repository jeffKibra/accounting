import { useRef } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useDisclosure,
  Button,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

function SaveDraftDialog(props) {
  const { loading, children, onConfirm } = props;

  const cancelRef = useRef(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children(onOpen)}

      <AlertDialog
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Save Draft?</AlertDialogHeader>
          <AlertDialogCloseButton isDisabled={loading} />
          <AlertDialogBody>
            You are saving this booking as a draft. Please note that the
            selected Vehicle will still be availble for booking by other
            customers and you might need to select another vehicle if the
            current vehicle will have been booked when you decide to confirm.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              type="button"
              onClick={onClose}
              isDisabled={loading}
              ref={cancelRef}
              colorScheme="red"
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={onConfirm}
              colorScheme="teal"
              ml={3}
              isLoading={loading}
            >
              save draft
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

SaveDraftDialog.propTypes = {
  loading: PropTypes.bool,
  children: PropTypes.func.isRequired,
};

export default SaveDraftDialog;
