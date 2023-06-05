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
import { useFormContext, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';

import ControlledSelect from 'components/ui/ControlledSelect';
import FieldArrayTextarea from 'components/ui/FieldArrayTextarea';
import FieldArrayNumberInput from 'components/ui/FieldArrayNumberInput';
// import ContactSelect from 'components/ui/ContactSelect';
import CustomSelect from 'components/ui/CustomSelect';

function CustomLabel({ children }) {
  return (
    <FormLabel fontSize="smaller" mb={0}>
      {children}
    </FormLabel>
  );
}

function EntryFields(props) {
  // console.log({ props });
  const { index, field, removeItem, taxesObject, loading, accountsObject } =
    props;

  const {
    formState: { errors },
    control,
  } = useFormContext();

  const fieldPrefix = `entries.${index}`;

  // const details = getValues(fieldPrefix);
  // console.log({ details });

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
            <GridItem colSpan={[6, 4]}>
              <FormControl isRequired isInvalid={!!itemErrors?.account}>
                <CustomLabel htmlFor={`${fieldPrefix}-account`}>
                  Account
                </CustomLabel>

                <Controller
                  name={`${fieldPrefix}.account`}
                  control={control}
                  rules={{ required: { value: true, message: '* Required!' } }}
                  render={({ field: { onChange, value: selectedAccount } }) => {
                    function handleAccountChange(accountId) {
                      const account = accountsObject[accountId];
                      onChange(account);
                    }

                    return (
                      <ControlledSelect
                        onChange={handleAccountChange}
                        value={selectedAccount?.accountId || ''}
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
                    );
                  }}
                />

                <FormErrorMessage>
                  {itemErrors?.account?.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[6, 4]}>
              <FormControl isDisabled={loading} isInvalid={errors.description}>
                <CustomLabel htmlFor="description">Description</CustomLabel>
                <FieldArrayTextarea
                  name={`${fieldPrefix}.description`}
                  inputProps={{
                    isDisabled: loading,
                    resize: 'none',
                    size: 'xs',
                    rows: 2,
                  }}
                />
                <FormErrorMessage>
                  {itemErrors?.description?.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>

            {/* <GridItem colSpan={[6, 4, 2]}>
              <FormControl isDisabled={loading} isInvalid={errors.contact}>
                <CustomLabel htmlFor="contact">Contact</CustomLabel>
                <ContactSelect name={`${fieldPrefix}.name`} />
                <FormErrorMessage>
                  {itemErrors?.contact?.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem> */}

            <GridItem colSpan={[6, 4, 2]}>
              <FormControl isInvalid={itemErrors?.tax}>
                <CustomLabel htmlFor={`${fieldPrefix}.tax`}>Tax</CustomLabel>
                <Controller
                  name={`${fieldPrefix}.tax`}
                  control={control}
                  render={({ field: { onChange, value: selectedTax } }) => {
                    function handleTaxChange(taxId) {
                      const tax = taxesObject[taxId];
                      onChange(tax);
                    }

                    return (
                      <ControlledSelect
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
                        onChange={handleTaxChange}
                        value={selectedTax?.taxId || ''}
                      />
                    );
                  }}
                />

                <FormErrorMessage>{itemErrors?.tax?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[6, 4, 1]}>
              <FormControl isRequired isInvalid={itemErrors?.type}>
                <CustomLabel htmlFor={`${fieldPrefix}.type`}>Type</CustomLabel>
                <CustomSelect
                  name={`${fieldPrefix}.type`}
                  options={[
                    { name: 'Debit', value: 'debit' },
                    { name: 'Credit', value: 'credit' },
                  ]}
                  size="sm"
                  isDisabled={loading}
                  placeholder="Entry Type"
                  controllerProps={{
                    rules: {
                      required: { value: true, message: '* Required!' },
                    },
                  }}
                />
                <FormErrorMessage>{itemErrors?.type?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[6, 4, 1]}>
              <FormControl isRequired isInvalid={itemErrors?.amount}>
                <CustomLabel htmlFor={`${fieldPrefix}.amount`}>
                  Amount
                </CustomLabel>
                <FieldArrayNumberInput
                  name={`${fieldPrefix}.amount`}
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
