// import { useRef } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  // ModalFooter,
  // Button,
  useDisclosure,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

function CustomModal(props) {
  const { title, renderTrigger, renderContent, closeOnOverlayClick } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  // const btnRef = useRef();
  return (
    <>
      {renderTrigger(onOpen)}

      <Modal
        onClose={onClose}
        // finalFocusRef={btnRef}
        isOpen={isOpen}
        scrollBehavior="inside"
        closeOnOverlayClick={closeOnOverlayClick}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{renderContent(onClose)}</ModalBody>
          {/* <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </>
  );
}

CustomModal.defaultProps = {
  closeOnOverlayClick: true,
};

CustomModal.propTypes = {
  title: PropTypes.string.isRequired,
  renderTrigger: PropTypes.func.isRequired,
  renderContent: PropTypes.func.isRequired,
  closeOnOverlayClick: PropTypes.bool.isRequired,
};

export default CustomModal;
