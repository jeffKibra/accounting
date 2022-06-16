import { useEffect } from "react";
import {
  FormControl,
  FormLabel,
  Select,
  FormErrorMessage,
  Button,
  Box,
  Flex,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { RiAddLine } from "react-icons/ri";
import { useForm, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";

import NumInput from "../../ui/NumInput";

const schema = yup.object().shape({
  itemId: yup.string().required("*Required!"),
  rate: yup
    .number()
    .typeError("Value must be a number")
    .positive("value must be a positive number!")
    .min(1, "Value should be greater than zero(0)!")
    .required("*Required"),
  quantity: yup
    .number()
    .typeError("Value must be a number")
    .positive("value must be a positive number!")
    .min(1, "Value should be greater than zero(0)!")
    .required("*Required"),
  discount: yup
    .number()
    .typeError("Value must be a number")
    .positive("value must be a positive number!")
    .min(0, "Value should not be less than zero(0)!")
    .required("*Required"),
  discountType: yup.string().required("*Required"),
});

function SelectItemForm(props) {
  const { items, handleFormSubmit, item, onClose } = props;
  const formMethods = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    ...(item ? { defaultValues: { ...item } } : {}),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = formMethods;

  const itemId = watch("itemId");

  useEffect(() => {
    if (itemId) {
      const item = items.find((item) => item.itemId === itemId);
      const { sellingPrice } = item;

      setValue("rate", sellingPrice);
    }
  }, [itemId, items, setValue]);

  function onSubmit(data) {
    // console.log({ data });
    onClose();
    handleFormSubmit(data);
    reset();
  }

  return (
    <FormProvider {...formMethods}>
      <Box as="form" role="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid rowGap={2} columnGap={2} templateColumns="repeat(12, 1fr)">
          <GridItem colSpan={12}>
            <FormControl isRequired isInvalid={errors.itemId}>
              <FormLabel htmlFor="itemId">Item</FormLabel>
              <Select
                id="itemId"
                placeholder="---select item---"
                {...register("itemId")}
              >
                {items.map((item, i) => {
                  const { name, variant, itemId } = item;

                  return (
                    <option key={i} value={itemId}>
                      {name} - {variant}
                    </option>
                  );
                })}
              </Select>
              <FormErrorMessage>{errors.itemId?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem colSpan={12}>
            {itemId && (
              <FormControl isInvalid={errors.rate}>
                <FormLabel htmlFor="rate">Rate</FormLabel>
                <NumInput name="rate" min={0} />
                <FormErrorMessage>{errors.rate?.message}</FormErrorMessage>
              </FormControl>
            )}
          </GridItem>
          <GridItem colSpan={12}>
            <FormControl isInvalid={errors.quantity}>
              <FormLabel htmlFor="quantity">Quantity</FormLabel>
              <NumInput name="quantity" defaultValue={1} min={1} />
              <FormErrorMessage>{errors.quantity?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem colSpan={7}>
            <FormControl isInvalid={errors.discount}>
              <FormLabel htmlFor="discount">Discount</FormLabel>
              <NumInput name="discount" min={0} />
              <FormErrorMessage>{errors.discount?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem colSpan={5}>
            <FormControl isInvalid={errors.discountType}>
              <FormLabel htmlFor="discountType">Discount Type</FormLabel>
              <Select
                id="discountType"
                defaultValue="KES"
                {...register("discountType")}
              >
                <option value="KES">KES</option>
                <option value="%">%</option>
              </Select>
              <FormErrorMessage>
                {errors.discountType?.message}
              </FormErrorMessage>
            </FormControl>
          </GridItem>
        </Grid>

        <Flex my={4} w="full" justify="flex-end">
          {onClose && (
            <Button mr={2} onClick={onClose}>
              CLOSE
            </Button>
          )}
          <Button type="submit" rightIcon={<RiAddLine />} colorScheme="cyan">
            ADD
          </Button>
        </Flex>
      </Box>
    </FormProvider>
  );
}

SelectItemForm.propTypes = {
  items: PropTypes.array.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  item: PropTypes.shape({
    itemId: PropTypes.string,
    rate: PropTypes.number,
    quantity: PropTypes.number,
    discount: PropTypes.number,
    discountType: PropTypes.string,
  }),
};

export default SelectItemForm;
