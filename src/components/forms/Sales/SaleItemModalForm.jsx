import { useEffect, useRef, useMemo } from 'react';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { FormProvider, useForm } from 'react-hook-form';
//
import SaleItemFormFields from './SaleItemFormFields';
import { getSalesItemData } from 'utils/sales';

//----------------------------------------------------------------------

SaleItemModalForm.propTypes = {
  children: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedContact: PropTypes.object,
};

function checkIfDateIsValid(date) {
  const dateIsValid = date && new Date(date).toDateString() !== 'Invalid Date';
  console.log({ dateIsValid });

  return dateIsValid;
}

export default function SaleItemModalForm({
  children,
  handleFormSubmit,
  handleFormCancel,
  defaultValues,
  isOpen,
  ...formFieldsProps
}) {
  // console.log({ defaultValues });
  const inputRef = useRef(null);

  const formDefaultValues = useMemo(() => {
    const dateRange = defaultValues?.dateRange;

    let defaultDateRange = [new Date(), new Date()];

    if (Array.isArray(dateRange)) {
      const dStartDate = dateRange[0];
      const dEndDate = dateRange[1];
      const startDateIsValid = checkIfDateIsValid(dStartDate);
      const endDateIsValid = checkIfDateIsValid(dEndDate);
      console.log({ startDateIsValid, endDateIsValid });

      if (dStartDate && dEndDate && startDateIsValid && endDateIsValid) {
        defaultDateRange = [new Date(dStartDate), new Date(dEndDate)];
      }
    }

    console.log({ defaultDateRange });

    return {
      item: defaultValues?.item || null,
      quantity: defaultValues?.quantity || 1,
      rate: defaultValues?.rate || 0,
      salesTax: defaultValues?.salesTax || null,
      dateRange: defaultDateRange,
    };
  }, [defaultValues]);

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: formDefaultValues,
  });
  const { handleSubmit, reset, trigger, getValues } = formMethods;

  useEffect(() => {
    console.log('default values have changed', formDefaultValues);

    reset(formDefaultValues);
  }, [formDefaultValues, reset]);

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
    console.log({ data });

    const saleItemData = getSalesItemData(data);
    console.log({ saleItemData });

    handleFormSubmit(saleItemData);

    //reset form
    reset();
  }

  function onCancel() {
    reset();
    handleFormCancel();
  }

  return (
    <>
      <FormProvider {...formMethods}>
        <Modal
          isOpen={isOpen}
          onClose={handleFormCancel}
          initialFocusRef={inputRef}
          // finalFocusRef={triggerRef}
          closeOnOverlayClick={false}
          scrollBehavior="inside"
          size="xl"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Item Sale Details</ModalHeader>

            <ModalCloseButton />
            <ModalBody>
              {/* {error ? (
              <Alert status="error" my={4}>
                <AlertIcon />
                {error?.message || 'Unknown Error!'}
              </Alert>
            ) : null} */}
              <form onSubmit={handleSubmit(onSubmit)}>
                <SaleItemFormFields {...formFieldsProps} />
              </form>
            </ModalBody>

            <ModalFooter>
              <Button mr={3} type="button" colorScheme="red" onClick={onCancel}>
                cancel
              </Button>
              <Button type="button" colorScheme="cyan" onClick={onSave}>
                save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </FormProvider>
    </>
  );
}
