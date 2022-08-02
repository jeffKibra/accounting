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

import TableNumInput from "components/ui/TableNumInput";
import ControlledSelect from "components/ui/ControlledSelect";

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
    index,
    field,
    updateFieldOnBlur,
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
      <Stack w="full" direction={["column", null, "row"]}>
        <Grid
          key={field.id}
          rowGap={2}
          columnGap={2}
          templateColumns="repeat(12, 1fr)"
          flexGrow={1}
        >
          <GridItem colSpan={[12, 6]}>
            <Controller
              name={`selectedItems.${index}.item`}
              control={control}
              shouldUnregister={true}
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
                        .map((originalItem, i) => {
                          const { name, variant, itemId, added } = originalItem;
                          /**
                           * to return a field:
                           * 1. if there is and itemToEdit and current item is similar to itemToEdit
                           * 2. return all field not marked as added if there is no itemToEdit
                           */
                          if (value?.itemId === itemId || !added) {
                            return {
                              name: `${name} - ${variant}`,
                              value: itemId,
                            };
                          } else {
                            //hide fields otherwise
                            return null;
                          }
                        })
                        .filter((item) => item)}
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
              shouldUnregister={true}
              rules={{ required: { value: true, message: "*Required" } }}
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
              <TableNumInput
                name={`selectedItems.${index}.rate`}
                rules={{
                  required: { value: true, message: "*Required" },
                  min: {
                    value: 1,
                    message: "Value should be greater than zero(0)!",
                  },
                }}
                min={1}
                onBlur={() => updateFieldOnBlur(index)}
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
              <TableNumInput
                name={`selectedItems.${index}.quantity`}
                rules={{
                  required: { value: true, message: "*Required" },
                  min: {
                    value: 1,
                    message: "Value should be greater than zero(0)!",
                  },
                }}
                min={1}
                onBlur={() => updateFieldOnBlur(index)}
                isDisabled={!selectedItem?.itemId}
              />
              <FormErrorMessage>
                {errors.editItem?.quantity?.message}
              </FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem colSpan={[6, 4, 1]}>
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
      <Divider />
    </Stack>
  );
}

SelectItemForm.propTypes = {
  itemsObject: PropTypes.object.isRequired,
  updateFieldOnBlur: PropTypes.func.isRequired,
  handleItemChange: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
  field: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

export default SelectItemForm;
