import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Button,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// import { AuthContext } from "../../store/contexts/auth/authContext";

function Logout() {
  const { loading } = useSelector(store => store.authReducer);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  function logout() {
    navigate('/logout');
    onClose();
  }

  return (
    <>
      <Button colorScheme="cyan" onClick={onOpen} w="full">
        sign out
      </Button>
      <Modal
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sign Out!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to SIGN OUT?</ModalBody>
          <ModalFooter justifyContent="space-around">
            <Button colorScheme="red" onClick={onClose}>
              cancel
            </Button>
            <Button isLoading={loading} onClick={logout} colorScheme="cyan">
              sign out
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Logout;
