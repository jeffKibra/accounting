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
} from '@chakra-ui/react';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';

import ControlledSelect from 'components/ui/ControlledSelect';
import FieldArrayTextarea from 'components/ui/FieldArrayTextarea';
import FieldArrayNumberInput from 'components/ui/FieldArrayNumberInput';
import ContactSelect from 'components/ui/ContactSelect';
import CustomSelect from 'components/ui/CustomSelect';

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
    index,
    field,
    removeItem,
    taxesObject,
    loading,
    handleSelectChange,
    accountsObject,
  } = props;

  const {
    formState: { errors },
    getValues,
  } = useFormContext();

  const fieldPrefix = `entries.${index}`;

  const details = getValues(fieldPrefix);
  console.log({ details });
  const { tax, account } = details;
  console.log({ tax });

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
              <FormControl isRequired isInvalid={!!itemErrors?.account}>
                <CustomLabel htmlFor={`${field.id}-account`}>
                  Account
                </CustomLabel>

                <ControlledSelect
                  onChange={accountId =>
                    handleSelectChange(
                      `${fieldPrefix}.account`,
                      accountId,
                      accountsObject
                    )
                  }
                  value={account?.accountId || ''}
                  id={`${field.id}-account`}
                  isDisabled={loading}
                  placeholder="select account"
                  allowClearSelection={false}
                  size="sm"
                  options={Object.values(accountsObject).map(account => {
                    const { name, accountId } = account;

                    return {
                      name,
                      value: accountId,
                    };
                  })}
                />

                <FormErrorMessage>
                  {itemErrors?.account?.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[6, 4, 3]}>
              <FormControl
                isDisabled={loading}
                isRequired
                isInvalid={errors.description}
              >
                <CustomLabel htmlFor="description">Description</CustomLabel>
                <FieldArrayTextarea
                  name={`entries.${index}.description`}
                  controllerProps={{
                    rules: { required: { value: true, message: '*Required!' } },
                  }}
                  inputProps={{
                    isDisabled: loading,
                    resize: 'none',
                    size: 'xs',
                    rows: 2,
                  }}
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
                <ContactSelect name={`entries.${index}.name`} />
                {/* <ControlledSelect
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
                /> */}
                <FormErrorMessage>{errors.contact?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[6, 4, 2]}>
              <FormControl isInvalid={itemErrors?.tax}>
                <CustomLabel htmlFor={`entries.${index}.tax`}>Tax</CustomLabel>
                <ControlledSelect
                  // name={`entries.${index}.tax`}
                  options={Object.values(taxesObject).map(tax => {
                    const { taxId, name, rate } = tax;

                    return {
                      name: `${name} (${rate}%)`,
                      value: taxId,
                    };
                  })}
                  size="sm"
                  isDisabled={loading}
                  placeholder="tax"
                  onChange={taxId =>
                    handleSelectChange(`${fieldPrefix}.tax`, taxId, taxesObject)
                  }
                  value={tax?.taxId || ''}
                />

                {/* <Controller
                  name={`entries.${index}.tax`}
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select {...field}>
                        <option value="">select tax</option>
                        {Object.values(taxesObject).map(tax => {
                          const { taxId, name, rate } = tax;

                          return (
                            <option value={taxId}>
                              {`${name} (${rate}%)`}
                            </option>
                          );
                        })}
                      </Select>
                    );
                  }}
                /> */}

                <FormErrorMessage>{itemErrors?.tax?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[6, 4, 1]}>
              <FormControl isInvalid={itemErrors?.type}>
                <CustomLabel htmlFor={`entries.${index}.type`}>
                  Type
                </CustomLabel>
                {/* <TableNumInput onBlur={() => } /> */}

                <CustomSelect
                  name={`entries.${index}.type`}
                  options={[
                    { name: 'Debit', value: 'debit' },
                    { name: 'Credit', value: 'credit' },
                  ]}
                  size="sm"
                  isDisabled={loading}
                  placeholder="Entry Type"
                />
                <FormErrorMessage>{itemErrors?.type?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[6, 4, 1]}>
              <FormControl isInvalid={itemErrors?.amount}>
                <CustomLabel htmlFor={`entries.${index}.amount`}>
                  Amount
                </CustomLabel>
                <FieldArrayNumberInput
                  name={`entries.${index}.amount`}
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
                  {itemErrors?.amount?.message}
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
  accountsObject: PropTypes.object.isRequired,
  entriesObject: PropTypes.object.isRequired,
  removeItem: PropTypes.func.isRequired,
  field: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  taxesObject: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  updateEntryField: PropTypes.func.isRequired,
  handleSelectChange: PropTypes.func.isRequired,
};

export default EntryFields;
