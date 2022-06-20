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

import Card, { CardContent } from "../../ui/Card";

const expenseAccounts = [
  {
    name: "Advertising and Marketing",
    value: "",
  },
  {
    name: "Automobile Expense",
    value: "",
  },
  {
    name: "Bad Debt",
    value: "",
  },
  {
    name: "Bank Fees and Charges",
    value: "",
  },
  {
    name: "Consultant Expense",
    value: "",
  },
  {
    name: "Credit Card Charges",
    value: "",
  },
  {
    name: "Depreciation Expense",
    value: "",
  },
  {
    name: "It and Internet Expense",
    value: "",
  },
  {
    name: "Janitorial Expense",
    value: "",
  },
  {
    name: "Lodging",
    value: "",
  },
  {
    name: "Meals and Entertainment",
    value: "",
  },
  {
    name: "Office Supplies",
    value: "",
  },
  {
    name: "Postage",
    value: "",
  },
  {
    name: "Printing and Stationery",
    value: "",
  },
  {
    name: "Purchase Discounts",
    value: "",
  },
  {
    name: "Rent Expense",
    value: "",
  },
  {
    name: "Repairs and Maintenance",
    value: "",
  },
  {
    name: "Salaries and Employment Wages",
    value: "",
  },
  {
    name: "Telephone Expense",
    value: "",
  },
  {
    name: "Travel Expense",
    value: "",
  },
  {
    name: "Other Expenses",
    value: "",
  },
  {
    name: "Uncategorized",
    value: "",
  },
];

function ItemForm(props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  function handleFormSubmit(data) {
    console.log({ data });
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
                  <FormLabel htmlFor="name">Expense Name </FormLabel>
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
                  <FormLabel htmlFor="type">Expense Type</FormLabel>
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
              <GridItem colSpan={[12, 8, 6]}>
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
                      maxHeight={200}
                      placeholder="select account"
                      id="costAccount"
                      {...register("costAccount", {
                        required: { value: true, message: "Required" },
                      })}
                      _focus={{
                        maxH: 200,
                      }}
                    >
                      {expenseAccounts.map((account, i) => {
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
                    />
                  </FormControl>
                  <FormControl isInvalid={errors.tax}>
                    <FormLabel htmlFor="costTax">Tax</FormLabel>
                    <Select id="costTax" {...register("costTax")}>
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

export default ItemForm;
