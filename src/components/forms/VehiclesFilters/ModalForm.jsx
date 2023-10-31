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
//
import VehiclesFiltersFormFields from './FormFields';

function getFacetsRatesRange(facets) {
  const min = facets?.ratesRange?.min || 0;
  const max = facets?.ratesRange?.max || 0;

  return [min, max];
}

function VehiclesFiltersModalForm(props) {
  const {
    closeOnOverlayClick,
    onSubmit,
    isOpen,
    onClose,
    facets,
    defaultValues,
    ...moreProps
  } = props;

  const defaultRatesRange = defaultValues?.rate || getFacetsRatesRange(facets);
  // console.log({ defaultRatesRange, facets });

  const formMethods = useForm({
    defaultValues: {
      rate: defaultRatesRange,
      color: [],
      make: [],
      model: [],
      type: [],
    },
  });
  const { handleSubmit } = formMethods;
  // const allFields = watch();

  // console.log({ allFields });

  // const btnRef = useRef();
  return (
    <>
      <FormProvider {...formMethods}>
        <Modal
          onClose={onClose}
          // finalFocusRef={btnRef}
          isOpen={isOpen}
          scrollBehavior="inside"
          closeOnOverlayClick={closeOnOverlayClick}
          {...moreProps}
        >
          <ModalOverlay />
          <form onSubmit={handleSubmit(onSubmit)}>
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
          </form>
        </Modal>
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
  defaultValues: PropTypes.object,
};

export default VehiclesFiltersModalForm;
