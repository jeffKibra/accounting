import { useContext } from 'react';
import {
  FormControl,
  Input,
  Select,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Button,
  Flex,
  Grid,
  GridItem,
  Box,
} from '@chakra-ui/react';
import { useForm, FormProvider } from 'react-hook-form';
import PropTypes from 'prop-types';

import CustomSelect from '../../ui/CustomSelect';

import { businessTypes } from '../../../constants';
import useToasts from '../../../hooks/useToasts';

import StepperContext from '../../../contexts/StepperContext';

function OrgDetailsForm(props) {
  const { loading, handleFormSubmit, defaultValues, isAdmin } = props;
  const { nextStep } = useContext(StepperContext);
  const toasts = useToasts();

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: {
      name: defaultValues?.name || '',
      industry: defaultValues?.industry || '',
      businessTypeId: defaultValues?.businessType?.value || '',
      phone: defaultValues?.phone || '',
      website: defaultValues?.website || '',
    },
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = formMethods;

  function next(data) {
    const { businessTypeId, ...formData } = data;
    const businessType = businessTypes.find(
      type => type.value === businessTypeId
    );
    if (!businessType) {
      return toasts.error('Selected business type not found!');
    }

    handleFormSubmit({ ...formData, businessType });
    nextStep();
  }

  return (
    <FormProvider {...formMethods}>
      <Box as="form" role="form" onSubmit={handleSubmit(next)}>
        <Grid gap={2} templateColumns="repeat(12, 1fr)">
          {isAdmin && (
            <GridItem colSpan={[12, 6]}>
              <FormControl
                isDisabled={loading}
                isRequired
                isInvalid={!!errors.organizaionName}
              >
                <FormLabel>Status</FormLabel>
                <Select
                  {...register('status', {
                    required: { value: true, message: 'Required!' },
                  })}
                >
                  <option value="">--select status--</option>
                  <option value="onboarding">Onboarding</option>
                  <option value="active">Active</option>{' '}
                  <option value="suspended">Suspended</option>
                </Select>
                <FormErrorMessage>{errors.status?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
          )}

          <GridItem colSpan={[12, 6]}>
            <FormControl
              isDisabled={loading}
              isRequired
              isInvalid={!!errors.name}
            >
              <FormLabel htmlFor="name">Organization Name</FormLabel>
              <Input
                id="name"
                {...register('name', {
                  required: { value: true, message: 'Required!' },
                })}
              />
              <FormHelperText>Company | Business Name</FormHelperText>
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem colSpan={[12, 6]}>
            <FormControl
              isDisabled={loading}
              isRequired
              isInvalid={!!errors.industry}
            >
              <FormLabel htmlFor="industry">Industry</FormLabel>
              <Input
                id="industry"
                {...register('industry', {
                  required: { value: true, message: 'Required!' },
                })}
              />
              <FormErrorMessage>{errors.industry?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem colSpan={[12, 6]}>
            <FormControl
              isDisabled={loading}
              isRequired
              isInvalid={!!errors.businessTypeId}
            >
              <FormLabel htmlFor="businessTypeId">
                What is your business type?
              </FormLabel>
              <CustomSelect
                name="businessTypeId"
                placeholder="--select type--"
                isDisabled={loading}
                rules={{ required: { value: true, message: 'Required!' } }}
                options={businessTypes}
              />
              <FormErrorMessage>
                {errors.businessTypeId?.message}
              </FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem colSpan={[12, 6]}>
            <FormControl
              isDisabled={loading}
              isRequired
              isInvalid={!!errors.phone}
            >
              <FormLabel htmlFor="phone">Phone</FormLabel>
              <Input
                id="phone"
                {...register('phone', {
                  required: { value: true, message: 'Required!' },
                })}
              />
              <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem colSpan={[12, 6]}>
            <FormControl isDisabled={loading} isInvalid={!!errors.website}>
              <FormLabel htmlFor="website">website</FormLabel>
              <Input id="website" {...register('website')} />
              <FormErrorMessage>{errors.website?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
        </Grid>

        <Flex mt={4} justify="center">
          <Button isLoading={loading} colorScheme="cyan" type="submit">
            next
          </Button>
        </Flex>
      </Box>
    </FormProvider>
  );
}

OrgDetailsForm.propTypes = {
  loading: PropTypes.bool.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  defaultValues: PropTypes.object,
};

export default OrgDetailsForm;
