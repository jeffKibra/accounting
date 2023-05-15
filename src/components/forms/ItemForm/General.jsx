import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  FormHelperText,
  Grid,
  GridItem,
  Textarea,
} from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';

import CustomSelect from 'components/ui/CustomSelect';
// import RadioInput from '../../ui/RadioInput';
import SKUInput from 'components/ui/SKUInput';

const types = [
  { name: 'Goods', value: 'goods' },
  { name: 'Services', value: 'services' },
  { name: 'Vehicle', value: 'vehicle' },
  // { name: 'Booking', value: 'booking' },
];

function General(props) {
  // console.log({ props });
  const { loading, accounts, itemIsVehicle } = props;

  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  const skuOption = watch('skuOption');

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

          <CustomSelect
            name="type"
            placeholder="select Type"
            isDisabled={loading}
            rules={{ required: { value: true, message: 'Required' } }}
            options={types}
          />
          {/* <RadioInput
            name="type"
            options={['goods', 'services']}
            rules={{ required: { value: true, message: '*Required!' } }}
            // defaultValue="goods"
          /> */}
          <FormErrorMessage>{errors?.type?.message}</FormErrorMessage>
          <FormHelperText>How is this item sold?</FormHelperText>
        </FormControl>
      </GridItem>

      <GridItem colSpan={12}>
        <FormControl
          isReadOnly={loading}
          w="full"
          isRequired
          isInvalid={errors.name}
        >
          <FormLabel htmlFor="name">
            {itemIsVehicle ? 'Registration' : 'Item Name'}{' '}
          </FormLabel>
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
          isReadOnly={loading || skuOption === 'auto'}
          isInvalid={errors.sku}
          isRequired
          display={itemIsVehicle ? 'none' : 'block'}
        >
          <FormLabel htmlFor="sku">SKU</FormLabel>
          {/* <Input
            id="sku"
            {...register('sku', {
              required: { value: true, message: '*Required!' },
            })}
            pr="40px"
          /> */}

          <SKUInput sourceField="name" />

          <FormErrorMessage>{errors?.sku?.message}</FormErrorMessage>
          <FormHelperText>
            (Stock Keeping Unit) Unique Item Identifier
          </FormHelperText>
        </FormControl>
      </GridItem>

      <GridItem colSpan={12}>
        <FormControl
          isDisabled={loading}
          isRequired
          isInvalid={errors.salesAccount}
          display={itemIsVehicle ? 'none' : 'block'}
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
          <FormLabel htmlFor="description">Description</FormLabel>
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
