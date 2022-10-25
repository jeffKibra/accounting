import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Box,
  Grid,
  GridItem,
  FormHelperText,
} from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';

const units = [
  'millilitres',
  'litres',
  'millimetres',
  'metres',
  'grams',
  'kilograms',
  'count',
  'pairs',
  'dozen',
  'box',
  'pieces',
  'units',
  'tablets',
];

function Details(props) {
  const { loading } = props;

  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  const skuOption = watch('skuOption');

  return (
    <Grid
      borderRadius="md"
      boxShadow="lg"
      border="1px solid #f2f2f2"
      p={6}
      rowGap={1}
      columnGap={4}
      templateColumns="repeat(12, 1fr)"
    >
      <GridItem colSpan={12}>
        <FormControl
          isReadOnly={loading || skuOption === 'auto'}
          isInvalid={errors.sku}
          isRequired
        >
          <FormLabel htmlFor="sku">SKU</FormLabel>
          <Input
            id="sku"
            {...register('sku', {
              required: { value: true, message: '*Required!' },
            })}
            pr="40px"
          />

          <FormErrorMessage>{errors?.sku?.message}</FormErrorMessage>
          <FormHelperText>
            (Stock Keeping Unit) Unique Item Identifier
          </FormHelperText>
        </FormControl>
      </GridItem>

      <GridItem colSpan={12}>
        <FormControl isReadOnly={loading} isRequired isInvalid={errors.unit}>
          <FormLabel htmlFor="unit">Unit</FormLabel>
          <Input
            id="unit"
            {...register('unit', {
              required: { value: true, message: 'Required' },
            })}
            list="unitList"
          />
          <datalist id="unitList">
            {units.map((unit, i) => {
              return (
                <Box as="option" textTransform="uppercase" key={i} value={unit}>
                  {unit}
                </Box>
              );
            })}
          </datalist>
          <FormErrorMessage>{errors?.unit?.message}</FormErrorMessage>
          <FormHelperText>Select or type in your custom unit.</FormHelperText>
        </FormControl>
      </GridItem>
      {/* <InputGroup>
            <Input
              id="sku"
              {...register('sku', {
                required: { value: true, message: '*Required!' },
              })}
              pr="40px"
            />
            <InputRightElement>
              <SKUOptions name="skuOption" defaultValue="auto" />
            </InputRightElement>
          </InputGroup> */}
    </Grid>
  );
}

Details.propTypes = {
  loading: PropTypes.bool.isRequired,
};

export default Details;
