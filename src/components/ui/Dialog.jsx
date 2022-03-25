import { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import {
  useDisclosure,
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";

function Dialog(props) {
  const { renderButton, title, message, onConfirm, loading, isDone } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  useEffect(() => {
    if (isDone) {
      onClose();
    }
  }, [isDone, onClose]);

  function handleConfirm() {
    onConfirm(onClose);
  }

  return (
    <>
      {renderButton(onOpen, onClose)}
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
        closeOnOverlayClick={!loading}
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>{title}?</AlertDialogHeader>
          <AlertDialogCloseButton isDisabled={loading} />
          <AlertDialogBody>{message}</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose} isDisabled={loading}>
              No
            </Button>
            <Button
              isLoading={loading}
              onClick={handleConfirm}
              colorScheme="red"
              ml={3}
            >
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

Dialog.propTypes = {
  renderButton: PropTypes.func.isRequired,
  title: PropTypes.any.isRequired,
  message: PropTypes.any.isRequired,
  onConfirm: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  isDone: PropTypes.bool.isRequired,
};

export default Dialog;
