import { useEffect } from "react";
import {
  FormControl,
  FormLabel,
  Select,
  FormErrorMessage,
  Button,
  Flex,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { RiAddLine } from "react-icons/ri";
import { useFormContext } from "react-hook-form";
import PropTypes from "prop-types";

import NumInput from "../../ui/NumInput";

function SelectItemForm(props) {
  const { itemsObject, handleFormSubmit, item, onClose } = props;

  const {
    register,
    formState: { errors },
    watch,
    setValue,
    getValues,
    unregister,
    trigger,
  } = useFormContext();

  const itemId = watch("editItem.itemId");

  useEffect(() => {
    //register an item field to hold the original item data
    register("editItem.item", {
      required: { value: true, message: "Item is Required" },
    });

    return () => {
      // unregister(["editItem.itemId", "editItem.rate", "editItem.quantity"]);
      unregister("editItem");
    };
  }, [unregister, register]);

  useEffect(() => {
    //set default values
    if (item) {
      console.log("item available", item);
      setValue("editItem.itemId", item.itemId);
      setValue("editItem.rate", item.rate);
      setValue("editItem.quantity", item.quantity);
    }
  }, [item, setValue]);

  useEffect(() => {
    if (itemId) {
      const selectedItem = itemsObject[itemId];
      const { sellingPrice } = selectedItem;

      //set values of item and rate and index
      setValue("editItem.item", selectedItem);
      setValue("editItem.rate", sellingPrice);
    }
  }, [itemId, itemsObject, setValue]);

  async function submitForm() {
    //trigger validation
    await trigger([
      "editItem.itemId",
      "editItem.item",
      "editItem.rate",
      "editItem.quantity",
    ]);
    const fieldsValid = Object.keys(errors).length === 0;
    //only submit the data when there are no errors
    if (fieldsValid) {
      //get data from form
      const editItem = getValues("editItem");
      //submit data- function will close the editor
      handleFormSubmit(editItem);
    }
  }

  return (
    <Grid rowGap={2} columnGap={2} templateColumns="repeat(12, 1fr)">
      <GridItem colSpan={12}>
        <FormControl isRequired isInvalid={errors.editItem?.itemId}>
          <FormLabel htmlFor="itemId">Item</FormLabel>
          <Select
            id="itemId"
            placeholder="---select item---"
            {...register("editItem.itemId", {
              required: { value: true, message: "*Required" },
            })}
          >
            {Object.values(itemsObject).map((item, i) => {
              const { name, variant, itemId, added } = item;

              if (added) {
                return null;
              }
              return (
                <option key={i} value={itemId}>
                  {name} - {variant}
                </option>
              );
            })}
          </Select>
          <FormErrorMessage>
            {errors.editItem?.itemId?.message}
          </FormErrorMessage>
          <FormErrorMessage>{errors.editItem?.item?.message}</FormErrorMessage>
        </FormControl>
      </GridItem>

      <GridItem colSpan={12}>
        <FormControl isInvalid={errors.editItem?.rate}>
          <FormLabel htmlFor="rate">Rate</FormLabel>
          <NumInput
            name="editItem.rate"
            rules={{
              required: { value: true, message: "*Required" },
              min: {
                value: 1,
                message: "Value should be greater than zero(0)!",
              },
            }}
            min={0}
          />
          <FormErrorMessage>{errors.editItem?.rate?.message}</FormErrorMessage>
        </FormControl>
      </GridItem>

      <GridItem colSpan={12}>
        <FormControl isInvalid={errors.editItem?.quantity}>
          <FormLabel htmlFor="quantity">Quantity</FormLabel>
          <NumInput
            name="editItem.quantity"
            rules={{
              required: { value: true, message: "*Required" },
              min: {
                value: 1,
                message: "Value should be greater than zero(0)!",
              },
            }}
            defaultValue={1}
            min={1}
          />
          <FormErrorMessage>
            {errors.editItem?.quantity?.message}
          </FormErrorMessage>
        </FormControl>
      </GridItem>

      <GridItem colSpan={12}>
        <Flex my={4} w="full" justify="flex-end">
          {onClose && (
            <Button type="button" mr={2} onClick={onClose}>
              CLOSE
            </Button>
          )}
          <Button
            onClick={submitForm}
            type="button"
            rightIcon={<RiAddLine />}
            colorScheme="cyan"
          >
            ADD
          </Button>
        </Flex>
      </GridItem>
    </Grid>
  );
}

SelectItemForm.propTypes = {
  itemsObject: PropTypes.object.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  item: PropTypes.shape({
    itemId: PropTypes.string,
    rate: PropTypes.number,
    quantity: PropTypes.number,
  }),
};

export default SelectItemForm;
