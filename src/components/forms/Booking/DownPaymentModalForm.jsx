import { useRef } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react';
import { useForm, FormProvider } from 'react-hook-form';
import PropTypes from 'prop-types';
//
//
import DownPaymentFields from 'components/forms/Booking/DownPaymentFields';

function DownPaymentModal(props) {
  const { paymentModes, loading, isOpen, onClose, onSubmit } = props;

  const initialRef = useRef(null);

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: {},
  });

  const { handleSubmit } = formMethods;

  function handleFormSubmit(data) {
    onSubmit(data);
  }

  return (
    <FormProvider {...formMethods}>
      <Modal
        scrollBehavior="inside"
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <ModalContent>
            <ModalHeader>Down Payment Details</ModalHeader>
            <ModalCloseButton isDisabled={loading} />

            <ModalBody pb={6}>
              <DownPaymentFields
                loading={loading}
                paymentModes={paymentModes}
                ref={initialRef}
              />
            </ModalBody>

            <ModalFooter>
              <Button
                type="button"
                isDisabled={loading}
                mr={3}
                onClick={onClose}
              >
                Cancel
              </Button>

              <Button type="submit" isLoading={loading} colorScheme="teal">
                confirm booking
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </FormProvider>
  );
}

DownPaymentModal.propTypes = {
  loading: PropTypes.bool,
  paymentModes: PropTypes.arrayOf(PropTypes.object).isRequired,
  children: PropTypes.func.isRequired,
};

export default DownPaymentModal;
