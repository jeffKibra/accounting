import { useRef } from "react";
import PropTypes from "prop-types";
import {
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";

function ControlledDialog(props) {
  const {
    onClose,
    isOpen,
    title,
    message,
    onConfirm,
    loading,
    cancelText,
    confirmText,
  } = props;
  const cancelRef = useRef();

  function handleConfirm() {
    onConfirm(onClose);
  }

  return (
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
            {cancelText || "cancel"}
          </Button>
          <Button
            isLoading={loading}
            onClick={handleConfirm}
            colorScheme="cyan"
            ml={3}
          >
            {confirmText || "continue"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

ControlledDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.any.isRequired,
  message: PropTypes.any.isRequired,
  onConfirm: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  cancelText: PropTypes.string,
  confirmText: PropTypes.string,
};

export default ControlledDialog;
