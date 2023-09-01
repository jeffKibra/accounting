import PropTypes from 'prop-types';
import { useEffect } from 'react';

import {
  Button,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalFooter,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Spinner,
} from '@chakra-ui/react';

import { useForm, FormProvider } from 'react-hook-form';

import { useAccountTypes } from 'hooks';

import FormFields from './FormFields';
import AlertError from 'components/ui/AlertError';

//-------------------------------------------------------------------
AccountModalForm.propTypes = {
  loading: PropTypes.bool.isRequired,
  defaultValues: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  modalTitle: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default function AccountModalForm({
  loading,
  defaultValues,
  isOpen,
  onClose,
  modalTitle,
  onSubmit,
}) {
  const { accountTypes, errorMsg, fetchAccountTypes } = useAccountTypes({
    defaultFetch: false,
  });

  useEffect(() => {
    if (isOpen && !accountTypes) {
      fetchAccountTypes();
    }
  }, [fetchAccountTypes, accountTypes, isOpen]);

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: {
      name: defaultValues?.name || '',
      accountType: defaultValues?.accountType || null,
      description: defaultValues?.description || '',
    },
  });

  const { handleSubmit } = formMethods;

  return (
    <FormProvider {...formMethods}>
      <Modal
        onClose={onClose}
        // finalFocusRef={btnRef}
        isOpen={isOpen}
        scrollBehavior="inside"
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <ModalOverlay />
        <ModalContent as="form" role="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>{modalTitle}</ModalHeader>

          <ModalCloseButton disabled={loading} />

          <ModalBody>
            {Array.isArray(accountTypes) ? (
              <FormFields accountTypes={accountTypes} loading={loading} />
            ) : errorMsg ? (
              <AlertError
                title="Error fetching Account Types"
                message={errorMsg}
              />
            ) : (
              <Box
                w="full"
                display="flex"
                justifyContent="center"
                h="full"
                py={6}
              >
                <Spinner />
              </Box>
            )}
          </ModalBody>

          <ModalFooter>
            <Button disabled={loading} colorScheme="red" onClick={onClose}>
              cancel
            </Button>

            <Button ml={4} colorScheme="cyan" type="submit" isLoading={loading}>
              save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </FormProvider>
  );
}
