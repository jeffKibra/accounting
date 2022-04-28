import { useEffect } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  Divider,
  VStack,
  Stack,
  Heading,
  Box,
  Textarea,
  Select,
  Grid,
  GridItem,
  RadioGroup,
  Radio,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormHelperText,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";

const units = [
  "millilitres",
  "litres",
  "millimetres",
  "metres",
  "grams",
  "kilograms",
  "count",
  "pairs",
  "dozen",
  "box",
  "pieces",
  "units",
  "tablets",
];

const sellingAccounts = [
  {
    name: "Discount",
    value: "discount",
  },
  {
    name: "General Income",
    value: "generalIncome",
  },
  {
    name: "Interest Income",
    value: "interestIncome",
  },
  {
    name: "Late Fee Income",
    value: "lateFeeIncome",
  },
  {
    name: "Other Charges",
    value: "otherCharges",
  },
  {
    name: "Sales",
    value: "sales",
  },
  {
    name: "Shipping Charge",
    value: "shippingCharge",
  },
];

const purchaseAccounts = [
  {
    name: "Cost of Goods",
    value: "costOfGoods",
  },
];

function ItemFormComponent(props) {
  console.log({ props });
  const { handleFormSubmit, item, loading, taxes } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({ mode: "onChange", defaultValues: { ...item } });

  const itemName = watch("name");
  const itemVariant = watch("variant");

  useEffect(() => {
    function refactor(string) {
      return String(string)
        .trim()
        .toLowerCase()
        .split(" ")
        .filter((val) => val !== "")
        .join("-");
    }

    const name = refactor(itemName);
    const variant = refactor(itemVariant);
    const id = `${name}${variant && `-${variant}`}`;
    // console.log({ name, variant, id });

    setValue("sku", id);
  }, [itemName, itemVariant, setValue]);

  // console.log(errors);
  return (
    <Box
      bg="white"
      w="full"
      borderRadius="md"
      shadow="md"
      p={4}
      as="form"
      role="form"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <VStack align="stretch" spacing={2}>
        <Grid columnGap={4} templateColumns="repeat(12, 1fr)">
          <GridItem colSpan={[12, 6]}>
            <FormControl
              isDisabled={loading}
              w="full"
              isRequired
              isInvalid={errors.name}
            >
              <FormLabel htmlFor="name">Item Name </FormLabel>
              <Input
                id="name"
                {...register("name", {
                  required: { value: true, message: "Required" },
                })}
              />

              <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem colSpan={[12, 6]}>
            <FormControl
              isDisabled={loading}
              w="full"
              isRequired
              isInvalid={errors.type}
            >
              <FormLabel htmlFor="type">Item Type</FormLabel>
              <RadioGroup defaultValue="goods">
                <Stack
                  direction="row"
                  {...register("type", {
                    required: { value: true, message: "Required" },
                  })}
                >
                  <Radio value="goods">Goods</Radio>
                  <Radio value="service">Service</Radio>
                </Stack>
              </RadioGroup>

              <FormErrorMessage>{errors?.type?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem colSpan={[12, 6]}>
            <FormControl
              isDisabled={loading}
              w="full"
              isInvalid={errors.variant}
            >
              <FormLabel htmlFor="variant">Item Variant </FormLabel>
              <Input id="variant" {...register("variant")} />
              <FormHelperText>e.g 250ml, 250g, black, small</FormHelperText>
              <FormErrorMessage>{errors?.variant?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem colSpan={[12, 6]}>
            <FormControl isDisabled w="full" isInvalid={errors.sku}>
              <FormLabel htmlFor="sku">SKU</FormLabel>
              <Input id="sku" {...register("sku")} />
              <FormHelperText>
                (Stock Keeping Unit) Unique Item Identifier
              </FormHelperText>
              <FormErrorMessage>{errors?.sku?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem colSpan={[12, 6]}>
            <FormControl
              isDisabled={loading}
              isRequired
              isInvalid={errors.unit}
            >
              <FormLabel htmlFor="unit">Unit</FormLabel>
              <Input
                id="unit"
                {...register("unit", {
                  required: { value: true, message: "Required" },
                })}
                list="unitList"
              />
              <datalist id="unitList">
                {units.map((unit, i) => {
                  return (
                    <Box
                      as="option"
                      textTransform="uppercase"
                      key={i}
                      value={unit}
                    >
                      {unit}
                    </Box>
                  );
                })}
              </datalist>
              <FormErrorMessage>
                {errors?.costAccount?.message}
              </FormErrorMessage>
              <FormHelperText>
                Select or type in your custom unit.
              </FormHelperText>
            </FormControl>
          </GridItem>

          <GridItem colSpan={[12, 6]}>
            <FormControl
              isDisabled={loading}
              isInvalid={errors.itemDescription}
            >
              <FormLabel htmlFor="itemDescription">Item Details</FormLabel>
              <Textarea id="itemDescription" {...register("itemDescription")} />
            </FormControl>
          </GridItem>
        </Grid>

        <Divider mb="30px !important" />
        <Grid columnGap={4} autoFlow="row" templateColumns="repeat(12, 1fr)">
          <GridItem colSpan={[12, 6]}>
            <VStack>
              <Box w="full">
                <Heading textAlign="left" size="sm" as="h4">
                  Sales Information
                </Heading>
              </Box>
              <Divider />
              <FormControl
                isDisabled={loading}
                isRequired
                isInvalid={errors.sellingPrice}
              >
                <FormLabel htmlFor="sellingPrice">
                  Selling Price (ksh)
                </FormLabel>
                <NumberInput>
                  <NumberInputField
                    id="sellingPrice"
                    {...register("sellingPrice", {
                      required: { value: true, message: "Required" },
                      valueAsNumber: true,
                    })}
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>

                <FormErrorMessage>
                  {errors?.sellingPrice?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isDisabled={loading}
                isRequired
                isInvalid={errors.sellingAccount}
              >
                <FormLabel htmlFor="sellingAccount">Account</FormLabel>
                <Select
                  placeholder="select account"
                  id="sellingAccount"
                  {...register("sellingAccount", {
                    required: { value: true, message: "Required" },
                  })}
                >
                  {sellingAccounts.map((account, i) => {
                    const { name, value } = account;
                    return (
                      <option value={value} key={i}>
                        {name}
                      </option>
                    );
                  })}
                </Select>

                <FormErrorMessage>
                  {errors?.sellingAccount?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                isDisabled={loading}
                isInvalid={errors.sellingDetails}
              >
                <FormLabel htmlFor="sellingDetails">Extra Details</FormLabel>
                <Textarea id="sellingDetails" {...register("sellingDetails")} />
              </FormControl>
              <FormControl isDisabled={loading} isInvalid={errors.taxId}>
                <FormLabel htmlFor="taxId">Tax</FormLabel>
                <Select
                  placeholder="select tax"
                  id="taxId"
                  {...register("taxId")}
                >
                  {taxes.map((tax, i) => {
                    const { name, rate, taxId } = tax;

                    return (
                      <option
                        value={taxId}
                        key={i}
                      >{`${name} -  ${rate}%`}</option>
                    );
                  })}
                </Select>
                <FormHelperText>Add tax to your item</FormHelperText>
              </FormControl>
            </VStack>
          </GridItem>

          <GridItem colSpan={[12, 6]}>
            {/* purchase information */}
            <VStack>
              <Box w="full">
                <Heading textAlign="left" size="sm" as="h4">
                  Purchase Information
                </Heading>
              </Box>
              <Divider />
              <FormControl
                isDisabled={loading}
                isRequired
                isInvalid={errors.costPrice}
              >
                <FormLabel htmlFor="costPrice">Cost Price (ksh)</FormLabel>
                <NumberInput>
                  <NumberInputField
                    id="costPrice"
                    {...register("costPrice", {
                      required: { value: true, message: "Required" },
                      valueAsNumber: true,
                    })}
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>

                <FormErrorMessage>
                  {errors?.costPrice?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isDisabled={loading}
                isRequired
                isInvalid={errors.costAccount}
              >
                <FormLabel htmlFor="costAccount">Account</FormLabel>
                <Select
                  placeholder="select account"
                  id="costAccount"
                  {...register("costAccount", {
                    required: { value: true, message: "Required" },
                  })}
                >
                  {purchaseAccounts.map((account, i) => {
                    const { name, value } = account;

                    return (
                      <option key={i} value={value}>
                        {name}
                      </option>
                    );
                  })}
                </Select>

                <FormErrorMessage>
                  {errors?.costAccount?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isDisabled={loading} isInvalid={errors.costDetails}>
                <FormLabel htmlFor="description">Extra Details</FormLabel>
                <Textarea
                  id="costDetails"
                  {...register("costDetails")}
                  defaultValue=""
                />
              </FormControl>
            </VStack>
          </GridItem>
        </Grid>

        <Stack w="full" direction={["column", "row"]}></Stack>

        <Box>
          <Button
            colorScheme="cyan"
            variant="outline"
            textTransform="uppercase"
            type="submit"
            isLoading={loading}
          >
            SAVE item
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}

ItemFormComponent.defaultProps = {
  item: { sku: "" },
};

ItemFormComponent.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  taxes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      rate: PropTypes.number.isRequired,
      taxId: PropTypes.string.isRequired,
    })
  ),
};

export default ItemFormComponent;
