import { useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Flex,
  Button,
  Box,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useForm, FormProvider } from 'react-hook-form';

import NumInput from '../../ui/NumInput';

function OpeningBalanceForm(props) {
  const { handleFormSubmit, openingBalance, loading, onClose, isModified } =
    props;

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: { amount: openingBalance || 0 },
  });

  const {
    formState: { errors },
    handleSubmit,
  } = formMethods;

  useEffect(() => {
    if (isModified) {
      onClose && onClose();
    }
  }, [isModified, onClose]);

  return (
    <FormProvider {...formMethods}>
      <Box
        pb={4}
        as="form"
        role="form"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <FormControl isDisabled={loading} isInvalid={!!errors.amount}>
          <FormLabel htmlFor="amount">Opening Balance</FormLabel>
          <NumInput
            name="amount"
            min={0}
            rules={{
              min: {
                value: 0,
                message: 'Value cannot be less than zero(0)!',
              },
            }}
          />
          <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
        </FormControl>

        <Flex justifyContent="flex-end" mt={4}>
          <Button
            isLoading={loading}
            variant="outline"
            colorScheme="cyan"
            onClick={onClose}
            mr={4}
          >
            cancel
          </Button>
          <Button isLoading={loading} colorScheme="cyan" type="submit">
            save
          </Button>
        </Flex>
      </Box>
    </FormProvider>
  );
}

OpeningBalanceForm.propTypes = {
  loading: PropTypes.bool.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  openingBalance: PropTypes.number.isRequired,
  onClose: PropTypes.func,
  isModified: PropTypes.bool.isRequired,
};

export default OpeningBalanceForm;
