import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Show,
  Divider,
  Stack,
  Textarea,
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

function EntryFields(props) {
  console.log({ props });
  const {
    itemsObject,
    entriesObject,
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
    getValues,
    register,
  } = useFormContext();

  const details = getValues(`entries.${index}`);
  const { item, tax } = details;

  const itemErrors = errors?.entries && errors?.entries[index];

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
            <GridItem colSpan={[6, 4, 3]}>
              <FormControl isRequired isInvalid={!!itemErrors?.item}>
                <CustomLabel htmlFor="item">Account</CustomLabel>

                <ControlledSelect
                  onChange={itemId => handleItemChange(itemId, index)}
                  value={item?.itemId || ''}
                  id={field.id}
                  isDisabled={loading}
                  placeholder="select account"
                  allowClearSelection={false}
                  size="sm"
                  options={Object.values(itemsObject)
                    .filter(originalItem => {
                      const { itemId } = originalItem;
                      /**
                       * filter to remove selected items-valid items include:
                       * 1. if there is and itemToEdit and current item is similar to itemToEdit
                       * 2. field is not in the selected items object
                       */
                      const accountAlreadySelected = entriesObject[itemId];
                      if (item?.itemId === itemId || !accountAlreadySelected) {
                        return true;
                      } else {
                        return false;
                      }
                    })
                    .map((originalItem, i) => {
                      const { name, itemId } = originalItem;

                      return {
                        name,
                        value: itemId,
                      };
                    })}
                />

                <FormErrorMessage>{itemErrors?.item?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[6, 4, 3]}>
              <FormControl
                isDisabled={loading}
                isRequired
                isInvalid={errors.description}
              >
                <CustomLabel htmlFor="description">Description</CustomLabel>
                <Textarea
                  {...register(`entries.${index}.description`, {
                    required: { value: true, message: '*Required!' },
                  })}
                  isDisabled={loading}
                  resize="none"
                  size="xs"
                  rows={2}
                />
                <FormErrorMessage>
                  {errors.description?.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[6, 4, 2]}>
              <FormControl
                isDisabled={loading}
                isRequired
                isInvalid={errors.contact}
              >
                <CustomLabel htmlFor="contact">Contact</CustomLabel>
                <ControlledSelect
                  name="contact"
                  size="sm"
                  placeholder="select contact"
                  isDisabled={loading}
                  rules={{ required: { value: true, message: '*Required!' } }}
                  // options={contacts.map(contact => {
                  //   const { contactId, displayName } = contact;

                  //   return { name: displayName, value: contactId };
                  // })}
                  options={[]}
                />
                <FormErrorMessage>{errors.contact?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[6, 4, 2]}>
              <FormControl isInvalid={itemErrors?.tax}>
                <CustomLabel htmlFor="tax">Tax</CustomLabel>
                <ControlledSelect
                  id={`${field.id}-tax`}
                  onChange={taxId => updateItemFields('tax', taxId, index)}
                  placeholder="Item Tax"
                  options={Object.values(taxesObject).map(tax => {
                    const { taxId, name, rate } = tax;

                    return {
                      name: `${name} (${rate}%)`,
                      value: taxId,
                    };
                  })}
                  size="sm"
                  value={tax?.taxId || ''}
                  isDisabled={loading}
                />

                <FormErrorMessage>{itemErrors?.tax?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[6, 4, 1]}>
              <FormControl isInvalid={itemErrors?.debit}>
                <CustomLabel htmlFor="debit">Debit</CustomLabel>
                {/* <TableNumInput onBlur={() => } /> */}
                <RHFPlainNumInput
                  name={`entries.${index}.debit`}
                  mode="onBlur"
                  updateValueOnBlur={false}
                  onBlur={value => updateItemFields('debit', value, index)}
                  rules={{
                    required: { value: true, message: '*Required' },
                    min: {
                      value: 1,
                      message: 'Value should be greater than zero(0)!',
                    },
                  }}
                  min={1}
                  size="sm"
                  isReadOnly={loading}
                  // isDisabled={loading}
                />

                <FormErrorMessage>
                  {itemErrors?.debit?.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[6, 4, 1]}>
              <FormControl isInvalid={itemErrors?.credit}>
                <CustomLabel htmlFor="credit">Credit</CustomLabel>
                <RHFPlainNumInput
                  name={`entries.${index}.credit`}
                  mode="onBlur"
                  updateValueOnBlur={false}
                  onBlur={value => updateItemFields('credit', value, index)}
                  min={1}
                  isReadOnly={loading}
                  // isDisabled={!item?.itemId}
                  size="sm"
                  rules={{
                    required: { value: true, message: '*Required' },
                    min: {
                      value: 1,
                      message: 'Value should be greater than zero(0)!',
                    },
                  }}
                />

                <FormErrorMessage>
                  {itemErrors?.credit?.message}
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

EntryFields.propTypes = {
  itemsObject: PropTypes.object.isRequired,
  entriesObject: PropTypes.object.isRequired,
  updateItemFields: PropTypes.func.isRequired,
  handleItemChange: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
  field: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  taxesObject: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default EntryFields;
