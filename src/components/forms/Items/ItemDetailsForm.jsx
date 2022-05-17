import { useEffect, useContext } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  VStack,
  Box,
  Textarea,
  Grid,
  GridItem,
  FormHelperText,
  Flex,
} from "@chakra-ui/react";
import { useForm, FormProvider } from "react-hook-form";
import PropTypes from "prop-types";

import StepperContext from "../../../contexts/StepperContext";

import RadioInput from "../../ui/RadioInput";

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

function ItemDetailsForm(props) {
  const { handleFormSubmit, defaultValues, loading } = props;

  const { nextStep } = useContext(StepperContext);

  const formMethods = useForm({
    mode: "onChange",
    defaultValues: defaultValues || {},
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = formMethods;

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

  function next(data) {
    handleFormSubmit(data);
    nextStep();
  }

  return (
    <FormProvider {...formMethods}>
      <Box
        w={["full", "80%"]}
        bg="white"
        borderRadius="md"
        shadow="md"
        p={4}
        as="form"
        role="form"
        onSubmit={handleSubmit(next)}
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
                <RadioInput
                  name="type"
                  options={["goods", "services"]}
                  rules={{ required: { value: true, message: "*Required!" } }}
                  // defaultValue="goods"
                />
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
              <FormControl
                isDisabled={loading}
                isReadOnly
                w="full"
                isInvalid={errors.sku}
              >
                <FormLabel htmlFor="sku">SKU</FormLabel>
                <Input
                  id="sku"
                  {...register("sku", {
                    required: { value: true, message: "*Required!" },
                  })}
                />
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
                <Textarea
                  id="itemDescription"
                  {...register("itemDescription")}
                />
              </FormControl>
            </GridItem>
          </Grid>

          <Flex pt={4} justify="center">
            <Button colorScheme="cyan" type="submit" isLoading={loading}>
              next
            </Button>
          </Flex>
        </VStack>
      </Box>
    </FormProvider>
  );
}

ItemDetailsForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  taxes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      rate: PropTypes.number.isRequired,
      taxId: PropTypes.string.isRequired,
    })
  ),
  defaultValues: PropTypes.object,
  accounts: PropTypes.array.isRequired,
};

export default ItemDetailsForm;
