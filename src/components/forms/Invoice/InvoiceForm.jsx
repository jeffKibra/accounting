import { useEffect } from "react";
import {
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberIncrementStepper,
  NumberDecrementStepper,
  NumberInputStepper,
  Select,
  FormErrorMessage,
  Button,
  Box,
  Flex,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { RiAddLine } from "react-icons/ri";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";

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
    .min(0, "Value should be greater than 0!")
    .required("*Required"),
  discountType: yup.string().required("*Required"),
});

function InvoiceForm(props) {
  const { items, handleFormSubmit, item, onClose } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    ...(item ? { defaultValues: { ...item } } : {}),
  });

  const itemId = watch("itemId");

  console.log({ itemId });

  useEffect(() => {
    if (itemId) {
      const item = items.find((item) => item.itemId === itemId);
      const { sellingPrice } = item;

      setValue("rate", sellingPrice);
    }
  }, [itemId, items, setValue]);

  function onSubmit(data) {
    // console.log({ data });
    handleFormSubmit(data);
    reset();
    onClose();
  }

  return (
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
            <Controller
              name="rate"
              //   defaultValue={rate}
              render={({ field: { onChange, ref, value } }) => {
                return (
                  <FormControl isInvalid={errors.rate}>
                    <FormLabel htmlFor="rate">Rate</FormLabel>
                    <NumberInput
                      min={0}
                      onChange={onChange}
                      value={value}
                      ref={ref}
                    >
                      <NumberInputField
                        id="rate"
                        // {...register("rate", { valueAsNumber: true })}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormErrorMessage>{errors.rate?.message}</FormErrorMessage>
                  </FormControl>
                );
              }}
              control={control}
            />
          )}
        </GridItem>
        <GridItem colSpan={12}>
          <FormControl isInvalid={errors.quantity}>
            <FormLabel htmlFor="quantity">Quantity</FormLabel>
            <NumberInput defaultValue={1} min={1}>
              <NumberInputField
                id="quantity"
                {...register("quantity", { valueAsNumber: true })}
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>{errors.quantity?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={7}>
          <FormControl isInvalid={errors.discount}>
            <FormLabel htmlFor="discount">Discount</FormLabel>
            <NumberInput defaultValue={0} min={0}>
              <NumberInputField
                id="quantity"
                {...register("discount", { valueAsNumber: true })}
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
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
            <FormErrorMessage>{errors.discountType?.message}</FormErrorMessage>
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
  );
}

InvoiceForm.propTypes = {
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

export default InvoiceForm;
