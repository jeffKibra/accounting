import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Grid,
  GridItem,
  Textarea,
} from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';

import CustomSelect from 'components/ui/CustomSelect';
import RadioInput from '../../ui/RadioInput';

function General(props) {
  const { loading, accounts } = props;

  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Grid
      borderRadius="md"
      shadow="xl"
      border="1px solid #f2f2f2"
      p={6}
      rowGap={1}
      columnGap={4}
      templateColumns="repeat(12, 1fr)"
    >
      <GridItem colSpan={12}>
        <FormControl
          isReadOnly={loading}
          w="full"
          isRequired
          isInvalid={errors.type}
        >
          <FormLabel htmlFor="type">Item Type</FormLabel>
          <RadioInput
            name="type"
            options={['goods', 'services']}
            rules={{ required: { value: true, message: '*Required!' } }}
            // defaultValue="goods"
          />
          <FormErrorMessage>{errors?.type?.message}</FormErrorMessage>
        </FormControl>
      </GridItem>

      <GridItem colSpan={12}>
        <FormControl
          isReadOnly={loading}
          w="full"
          isRequired
          isInvalid={errors.name}
        >
          <FormLabel htmlFor="name">Item Name </FormLabel>
          <Input
            id="name"
            {...register('name', {
              required: { value: true, message: 'Required' },
            })}
          />

          <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
        </FormControl>
      </GridItem>

      <GridItem colSpan={12}>
        <FormControl
          isDisabled={loading}
          isRequired
          isInvalid={errors.salesAccount}
        >
          <FormLabel htmlFor="salesAccount">Account</FormLabel>
          <CustomSelect
            name="salesAccount"
            placeholder="sales account"
            isDisabled={loading}
            rules={{ required: { value: true, message: 'Required' } }}
            options={accounts.map((account, i) => {
              const { name, accountId } = account;
              return {
                name,
                value: accountId,
              };
            })}
          />
          <FormErrorMessage>{errors?.salesAccount?.message}</FormErrorMessage>
        </FormControl>
      </GridItem>

      <GridItem colSpan={12}>
        <FormControl isDisabled={loading} isInvalid={errors.description}>
          <FormLabel htmlFor="description">Extra Details</FormLabel>
          <Textarea id="description" {...register('description')} />
          <FormErrorMessage>{errors?.description?.message}</FormErrorMessage>
        </FormControl>
      </GridItem>

      {/* <GridItem colSpan={12}>
          <FormControl isReadOnly={loading} w="full" isInvalid={errors.variant}>
            <FormLabel htmlFor="variant">Item Variant </FormLabel>
            <Input id="variant" {...register('variant')} />
            <FormHelperText>e.g 250ml, 250g, black, small</FormHelperText>
            <FormErrorMessage>{errors?.variant?.message}</FormErrorMessage>
          </FormControl>
        </GridItem> */}
    </Grid>
  );
}

General.propTypes = {
  loading: PropTypes.bool.isRequired,
  accounts: PropTypes.array.isRequired,
};

export default General;
