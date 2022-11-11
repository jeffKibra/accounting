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

export default function AccountForm({
  loading,
  defaultValues,
  isOpen,
  onClose,
  modalTitle,
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
      code: defaultValues?.code || '',
      description: defaultValues?.description || '',
    },
  });

  function onSubmit(data) {
    console.log({ data });
  }

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

          <ModalCloseButton />

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
            <Button colorScheme="red">cancel</Button>

            <Button ml={4} colorScheme="cyan" type="submit" isLoading={loading}>
              save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </FormProvider>
  );
}
