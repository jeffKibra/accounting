import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  HStack,
  Button,
  Flex,
} from '@chakra-ui/react';
import { useForm, FormProvider } from 'react-hook-form';
import PropTypes from 'prop-types';
//
import VehiclesFiltersFormFields from './FormFields';

function VehiclesFiltersModalForm(props) {
  const {
    closeOnOverlayClick,
    onSubmit,
    isOpen,
    onClose,
    facets,
    ...moreProps
  } = props;

  const formMethods = useForm();
  const { handleSubmit } = formMethods;

  function handleFormSubmit(data) {
    console.log({ data });
    //close modal
    onClose();
  }

  // const btnRef = useRef();
  return (
    <>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Modal
            onClose={onClose}
            // finalFocusRef={btnRef}
            isOpen={isOpen}
            scrollBehavior="inside"
            closeOnOverlayClick={closeOnOverlayClick}
            {...moreProps}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Filter Vehicles</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VehiclesFiltersFormFields facets={facets} />
              </ModalBody>

              <ModalFooter>
                <Flex w="full" justify="flex-end">
                  <HStack spacing={4}>
                    <Button type="button" onClick={onClose} colorScheme="red">
                      close
                    </Button>

                    <Button type="submit" colorScheme="cyan">
                      apply
                    </Button>
                  </HStack>
                </Flex>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </form>
      </FormProvider>
    </>
  );
}

VehiclesFiltersModalForm.defaultProps = {
  closeOnOverlayClick: false,
};

VehiclesFiltersModalForm.propTypes = {
  closeOnOverlayClick: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  facets: PropTypes.object,
};

export default VehiclesFiltersModalForm;
