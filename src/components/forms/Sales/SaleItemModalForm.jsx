import { useRef } from 'react';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Button,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { FormProvider, useForm } from 'react-hook-form';

import SaleItemFormFields from './SaleItemFormFields';

//----------------------------------------------------------------------

SaleItemFormFieldsModal.propTypes = {
  children: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedContact: PropTypes.object,
};

export default function SaleItemFormFieldsModal({
  children,
  handleFormSubmit,
  defaultValues,
  ...formFieldsProps
}) {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const inputRef = useRef(null);
  const triggerRef = useRef(null);

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: {
      quantity: defaultValues?.quantity || 1,
      rate: defaultValues?.rate || 0,
      startDate: defaultValues?.startDate || new Date(),
      endDate: defaultValues?.endDate || new Date(),
    },
  });
  const { handleSubmit, reset, trigger, getValues } = formMethods;

  async function onSave(e) {
    const fieldsAreValid = await trigger();
    console.log({ fieldsAreValid });

    if (!fieldsAreValid) {
      return;
    }

    const data = getValues();
    console.log({ data });

    onSubmit(data);
  }

  function onSubmit(data) {
    onClose();

    handleFormSubmit(data);
  }

  function onCancel() {
    reset();
    onClose();
  }

  return (
    <>
      {children(onOpen, triggerRef)}

      <FormProvider {...formMethods}>
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          initialFocusRef={inputRef}
          finalFocusRef={triggerRef}
          closeOnOverlayClick={false}
          scrollBehavior="inside"
          size="xl"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Item Sale Details</ModalHeader>

            <ModalCloseButton />
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalBody>
                {/* {error ? (
              <Alert status="error" my={4}>
                <AlertIcon />
                {error?.message || 'Unknown Error!'}
              </Alert>
            ) : null} */}

                <SaleItemFormFields {...formFieldsProps} />
              </ModalBody>

              <ModalFooter>
                <Button
                  mr={3}
                  type="button"
                  colorScheme="red"
                  onClick={onCancel}
                >
                  cancel
                </Button>
                <Button type="button" colorScheme="cyan" onClick={onSave}>
                  save
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </FormProvider>
    </>
  );
}
