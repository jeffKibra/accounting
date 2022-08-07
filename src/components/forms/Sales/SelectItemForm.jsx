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
} from "@chakra-ui/react";
import { RiDeleteBinLine } from "react-icons/ri";
import { useFormContext, Controller } from "react-hook-form";
import PropTypes from "prop-types";

import ControlledSelect from "components/ui/ControlledSelect";
import RHFPlainNumInput from "components/ui/RHFPlainNumInput";

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
    updateItemOnFieldBlur,
    handleItemChange,
    removeItem,
  } = props;

  const {
    formState: { errors },
    watch,
    getValues,
    control,
  } = useFormContext();

  const taxType = watch("summary.taxType");
  const selectedItem = getValues(`selectedItems.${index}.item`);

  return (
    <Stack direction="column" mt="0px!important">
      <FormControl
        isInvalid={!!errors?.selectedItems && errors.selectedItems[index]}
      >
        <Stack w="full" direction={["column", null, "row"]}>
          <Grid
            key={field.id}
            rowGap={2}
            columnGap={2}
            templateColumns="repeat(12, 1fr)"
            flexGrow={1}
          >
            <GridItem colSpan={[12, 6, 5]}>
              <Controller
                name={`selectedItems.${index}.item`}
                control={control}
                rules={{
                  required: { value: true, message: "*Required" },
                }}
                render={({
                  field: { value, onChange, onBlur },
                  fieldState: { error },
                }) => {
                  return (
                    <FormControl isRequired isInvalid={!!error?.message}>
                      <CustomLabel htmlFor="item">Item</CustomLabel>
                      <ControlledSelect
                        onChange={(itemId) =>
                          handleItemChange(itemId, index, onChange)
                        }
                        value={value?.itemId || ""}
                        id={field.id}
                        placeholder="---select item---"
                        onBlur={onBlur}
                        allowClearSelection={false}
                        options={Object.values(itemsObject)
                          .filter((originalItem) => {
                            const { itemId } = originalItem;
                            /**
                             * filter to remove selected items-valid items include:
                             * 1. if there is and itemToEdit and current item is similar to itemToEdit
                             * 2. field is not in the selected items object
                             */
                            const itemInSelectedItems =
                              selectedItemsObject[itemId];
                            if (
                              value?.itemId === itemId ||
                              !itemInSelectedItems
                            ) {
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

                      <FormErrorMessage>
                        {errors.editItem?.item?.message}
                      </FormErrorMessage>
                    </FormControl>
                  );
                }}
              />
            </GridItem>

            <GridItem colSpan={[6, null, 3]}>
              <Controller
                name={`selectedItems.${index}.salesTax`}
                control={control}
                render={({ field: { name, onChange, value, onBlur } }) => {
                  function handleTaxChange(taxId) {
                    // console.log({ taxId });
                    //todo: handle tax change for sale
                  }

                  return (
                    <FormControl isInvalid={errors.selectedItems?.salesTax}>
                      <CustomLabel htmlFor="salesTax">Item Tax</CustomLabel>
                      <ControlledSelect
                        id={`${field.id}-salesTax`}
                        onChange={handleTaxChange}
                        onBlur={onBlur}
                        placeholder="Item Tax"
                        options={[]}
                        value={value?.taxId || ""}
                        isDisabled={!selectedItem?.itemId}
                      />

                      <FormErrorMessage>
                        {errors.selectedItems?.salesTax?.message}
                      </FormErrorMessage>
                    </FormControl>
                  );
                }}
              />
            </GridItem>

            <GridItem colSpan={[6, 4, 1]}>
              <FormControl isInvalid={errors.selectedItems?.rate}>
                <CustomLabel htmlFor="rate">Rate</CustomLabel>
                {/* <TableNumInput onBlur={() => } /> */}
                <RHFPlainNumInput
                  name={`selectedItems.${index}.rate`}
                  mode="onBlur"
                  updateValueOnBlur={false}
                  onBlur={(value) =>
                    updateItemOnFieldBlur("rate", value, index)
                  }
                  rules={{
                    required: { value: true, message: "*Required" },
                    min: {
                      value: 1,
                      message: "Value should be greater than zero(0)!",
                    },
                  }}
                  min={1}
                  isDisabled={!selectedItem?.itemId}
                />

                <FormErrorMessage>
                  {errors.selectedItems?.rate?.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[6, 4, 1]}>
              <FormControl isInvalid={errors.selectedItems?.quantity}>
                <CustomLabel htmlFor="quantity">Quantity</CustomLabel>
                <RHFPlainNumInput
                  name={`selectedItems.${index}.quantity`}
                  mode="onBlur"
                  updateValueOnBlur={false}
                  onBlur={(value) =>
                    updateItemOnFieldBlur("quantity", value, index)
                  }
                  min={1}
                  isDisabled={!selectedItem?.itemId}
                  rules={{
                    required: { value: true, message: "*Required" },
                    min: {
                      value: 1,
                      message: "Value should be greater than zero(0)!",
                    },
                  }}
                />

                <FormErrorMessage>
                  {errors.editItem?.quantity?.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[6, 4, 2]}>
              <FormControl isInvalid={errors.selectedItems?.itemRateTotal}>
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
                      h="32px"
                      w="full"
                    >
                      <Heading size="xs">
                        {taxType === "taxInclusive"
                          ? itemTaxTotal + itemRateTotal
                          : itemRateTotal}
                      </Heading>
                    </Flex>
                  );
                })()}

                <FormErrorMessage>
                  {errors.editItem?.quantity?.message}
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
  updateItemOnFieldBlur: PropTypes.func.isRequired,
  handleItemChange: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
  field: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

export default SelectItemForm;
