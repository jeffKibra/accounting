import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Heading,
  Show,
  Divider,
  Stack,
} from '@chakra-ui/react';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';

import ControlledSelect from 'components/ui/ControlledSelect';
import RHFPlainNumInput from 'components/ui/RHFPlainNumInput';

function CustomLabel({ children }) {
  return (
    <FormLabel fontSize="smaller" mb={0}>
      {children}
    </FormLabel>
  );
}

function SelectItemForm(props) {
  const {
    itemsObject,
    selectedItemsObject,
    index,
    field,
    updateItemFields,
    handleItemChange,
    removeItem,
    taxesObject,
    loading,
  } = props;

  const {
    formState: { errors },
    watch,
    getValues,
  } = useFormContext();

  const taxType = watch('summary.taxType');
  const details = getValues(`selectedItems.${index}`);
  const { item, salesTax } = details;

  const itemErrors = errors?.selectedItems && errors?.selectedItems[index];

  return (
    <Stack direction="column" mt="0px!important">
      <FormControl isInvalid={!!itemErrors}>
        <Stack w="full" direction={['column', null, 'row']}>
          <Grid
            key={field.id}
            rowGap={2}
            columnGap={2}
            templateColumns="repeat(12, 1fr)"
            flexGrow={1}
          >
            <GridItem colSpan={[12, 6, 5]}>
              <FormControl isRequired isInvalid={!!itemErrors?.item}>
                <CustomLabel htmlFor="item">Item</CustomLabel>
                <ControlledSelect
                  onChange={itemId => handleItemChange(itemId, index)}
                  value={item?.itemId || ''}
                  id={field.id}
                  isDisabled={loading}
                  placeholder="---select item---"
                  allowClearSelection={false}
                  options={Object.values(itemsObject)
                    .filter(originalItem => {
                      const { itemId } = originalItem;
                      /**
                       * filter to remove selected items-valid items include:
                       * 1. if there is and itemToEdit and current item is similar to itemToEdit
                       * 2. field is not in the selected items object
                       */
                      const itemInSelectedItems = selectedItemsObject[itemId];
                      if (item?.itemId === itemId || !itemInSelectedItems) {
                        return true;
                      } else {
                        return false;
                      }
                    })
                    .map((originalItem, i) => {
                      const { name, variant, itemId } = originalItem;

                      return {
                        name: `${name} - ${variant}`,
                        value: itemId,
                      };
                    })}
                />

                <FormErrorMessage>{itemErrors?.item?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[6, null, 3]}>
              <FormControl isInvalid={itemErrors?.salesTax}>
                <CustomLabel htmlFor="salesTax">Item Tax</CustomLabel>
                <ControlledSelect
                  id={`${field.id}-salesTax`}
                  onChange={taxId => updateItemFields('salesTax', taxId, index)}
                  placeholder="Item Tax"
                  options={Object.values(taxesObject).map(tax => {
                    const { taxId, name, rate } = tax;

                    return {
                      name: `${name} (${rate}%)`,
                      value: taxId,
                    };
                  })}
                  value={salesTax?.taxId || ''}
                  isDisabled={!item?.itemId || loading}
                />

                <FormErrorMessage>
                  {itemErrors?.salesTax?.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[6, 4, 1]}>
              <FormControl isInvalid={itemErrors?.rate}>
                <CustomLabel htmlFor="rate">Rate</CustomLabel>
                {/* <TableNumInput onBlur={() => } /> */}
                <RHFPlainNumInput
                  name={`selectedItems.${index}.rate`}
                  mode="onBlur"
                  updateValueOnBlur={false}
                  onBlur={value => updateItemFields('rate', value, index)}
                  rules={{
                    required: { value: true, message: '*Required' },
                    min: {
                      value: 1,
                      message: 'Value should be greater than zero(0)!',
                    },
                  }}
                  min={1}
                  isReadOnly={loading}
                  isDisabled={!item?.itemId}
                />

                <FormErrorMessage>{itemErrors?.rate?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[6, 4, 1]}>
              <FormControl isInvalid={itemErrors?.quantity}>
                <CustomLabel htmlFor="quantity">Quantity</CustomLabel>
                <RHFPlainNumInput
                  name={`selectedItems.${index}.quantity`}
                  mode="onBlur"
                  updateValueOnBlur={false}
                  onBlur={value => updateItemFields('quantity', value, index)}
                  min={1}
                  isReadOnly={loading}
                  isDisabled={!item?.itemId}
                  rules={{
                    required: { value: true, message: '*Required' },
                    min: {
                      value: 1,
                      message: 'Value should be greater than zero(0)!',
                    },
                  }}
                />

                <FormErrorMessage>
                  {itemErrors?.quantity?.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[6, 4, 2]}>
              <FormControl isInvalid={itemErrors?.itemRateTotal}>
                <FormLabel textAlign="right" fontSize="smaller" mb={0}>
                  Total
                </FormLabel>

                {(() => {
                  const fieldValues = getValues(`selectedItems.${index}`);
                  const itemRateTotal = fieldValues?.itemRateTotal || 0;
                  const itemTaxTotal = fieldValues?.itemTaxTotal || 0;

                  return (
                    <Flex
                      justifyContent="flex-end"
                      alignItems="center"
                      px={2}
                      h="40px"
                      w="full"
                    >
                      <Heading size="sm">
                        {taxType === 'taxInclusive'
                          ? itemTaxTotal + itemRateTotal
                          : itemRateTotal}
                      </Heading>
                    </Flex>
                  );
                })()}

                <FormErrorMessage>
                  {itemErrors?.quantity?.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>
          </Grid>

          <Show above="md">
            <Flex alignItems="flex-end" justifyContent="flex-end">
              <IconButton
                ml={1}
                size="sm"
                borderRadius="sm"
                colorScheme="red"
                icon={<RiDeleteBinLine />}
                onClick={() => removeItem(index)}
                title="remove item"
                disabled={loading}
              />
            </Flex>
          </Show>

          <Show below="md">
            <Flex w="full" alignItems="flex-end" justifyContent="flex-end">
              <Button
                mt={1}
                size="sm"
                borderRadius="sm"
                colorScheme="red"
                leftIcon={<RiDeleteBinLine />}
                variant="ghost"
                onClick={() => removeItem(index)}
                disabled={loading}
              >
                Remove
              </Button>
            </Flex>
          </Show>
        </Stack>

        <FormErrorMessage mt="0px!important">
          Please enter valid item details or delete the line to continue
        </FormErrorMessage>
      </FormControl>

      <Divider />
    </Stack>
  );
}

SelectItemForm.propTypes = {
  itemsObject: PropTypes.object.isRequired,
  selectedItemsObject: PropTypes.object.isRequired,
  updateItemFields: PropTypes.func.isRequired,
  handleItemChange: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
  field: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  taxesObject: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default SelectItemForm;
