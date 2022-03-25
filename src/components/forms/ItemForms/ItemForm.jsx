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
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";

import Card, { CardContent } from "../../ui/Card";

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

function ItemForm(props) {
  const { createItem } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  function handleFormSubmit(data) {
    console.log({ data });
    createItem(data);
  }
  console.log(errors);
  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <VStack align="stretch" spacing={2}>
            <Grid columnGap={4} templateColumns="repeat(12, 1fr)">
              <GridItem colSpan={[12, 6]}>
                <FormControl w="full" isInvalid={errors.name}>
                  <FormLabel htmlFor="name">Item Name </FormLabel>
                  <Input
                    size="sm"
                    id="name"
                    {...register("name", {
                      required: { value: true, message: "Required" },
                    })}
                  />

                  <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
                </FormControl>
              </GridItem>
              <GridItem colSpan={[12, 6]}>
                <FormControl w="full" isInvalid={errors.type}>
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
            </Grid>

            <Divider />
            <Grid
              columnGap={4}
              autoFlow="row"
              templateColumns="repeat(12, 1fr)"
            >
              <GridItem colSpan={[12, 6]}>
                <VStack>
                  <Box w="full">
                    <Heading textAlign="left" size="sm" as="h4">
                      Sales Information
                    </Heading>
                  </Box>
                  <Divider />
                  <FormControl isInvalid={errors.sellingPrice}>
                    <FormLabel htmlFor="sellingPrice">Selling Price</FormLabel>
                    <NumberInput>
                      <NumberInputField
                        id="sellingPrice"
                        {...register("sellingPrice", {
                          required: { value: true, message: "Required" },
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
                  <FormControl isInvalid={errors.sellingAccount}>
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

                  <FormControl isInvalid={errors.sellingDescription}>
                    <FormLabel htmlFor="sellingDescription">
                      Description
                    </FormLabel>
                    <Textarea
                      id="sellingDescription"
                      {...register("sellingDescription")}
                    />
                  </FormControl>
                  <FormControl isInvalid={errors.tax}>
                    <FormLabel htmlFor="sellingTax">Tax</FormLabel>
                    <Select
                      placeholder="select tax account"
                      id="sellingTax"
                      {...register("sellingTax")}
                    >
                      <option></option>
                    </Select>
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
                  <FormControl isInvalid={errors.costPrice}>
                    <FormLabel htmlFor="costPrice">Cost Price</FormLabel>
                    <NumberInput>
                      <NumberInputField
                        id="costPrice"
                        {...register("costPrice", {
                          required: { value: true, message: "Required" },
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
                  <FormControl isInvalid={errors.costAccount}>
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
                  <FormControl isInvalid={errors.costDescription}>
                    <FormLabel htmlFor="description">Description</FormLabel>
                    <Textarea
                      id="costDescription"
                      {...register("costDescription")}
                      defaultValue=""
                    />
                  </FormControl>
                  <FormControl isInvalid={errors.tax}>
                    <FormLabel htmlFor="costTax">Tax</FormLabel>
                    <Select
                      placeholder="select tax account"
                      id="costTax"
                      {...register("costTax")}
                    >
                      <option></option>
                    </Select>
                  </FormControl>
                </VStack>
              </GridItem>
            </Grid>

            <Stack w="full" direction={["column", "row"]}></Stack>

            <Box>
              <Button
                size="sm"
                colorScheme="cyan"
                variant="outline"
                textTransform="uppercase"
                type="submit"
              >
                SAVE
              </Button>
            </Box>
          </VStack>
        </form>
      </CardContent>
    </Card>
  );
}

ItemForm.propTypes = {
  createItem: PropTypes.func.isRequired,
};

export default ItemForm;
