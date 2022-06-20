import { useEffect, useContext, useMemo } from "react";
import {
  FormControl,
  FormLabel,
  InputGroup,
  Input,
  InputRightElement,
  FormErrorMessage,
  Button,
  Box,
  Grid,
  GridItem,
  FormHelperText,
  Flex,
  Container,
} from "@chakra-ui/react";
import { useForm, FormProvider } from "react-hook-form";
import PropTypes from "prop-types";

import StepperContext from "../../../contexts/StepperContext";

import RadioInput from "../../ui/RadioInput";
import NumInput from "../../ui/NumInput";
import SKUOptions from "./SKUOptions";

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

  const defaults = useMemo(() => {
    return {
      name: defaultValues?.name || "",
      type: defaultValues?.type || "",
      variant: defaultValues?.variant || "",
      sku: defaultValues?.sku || "",
      skuOption: defaultValues?.skuOption || "barcode",
      unit: defaultValues?.unit || "",
      costPrice: defaultValues?.costPrice || 0,
    };
  }, [defaultValues]);

  const formMethods = useForm({
    mode: "onChange",
    defaultValues: { ...defaults },
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
  const skuOption = watch("skuOption");

  useEffect(() => {
    if (skuOption === "auto") {
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
    }
  }, [itemName, itemVariant, setValue, skuOption]);

  function next(data) {
    handleFormSubmit(data);
    nextStep();
  }

  return (
    <Container
      bg="white"
      borderRadius="md"
      shadow="md"
      p={4}
      maxW="container.sm"
    >
      <FormProvider {...formMethods}>
        <Container py={4} as="form" role="form" onSubmit={handleSubmit(next)}>
          <Grid rowGap={1} columnGap={4} templateColumns="repeat(12, 1fr)">
            <GridItem colSpan={[12, 6]}>
              <FormControl
                isReadOnly={loading}
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
                isReadOnly={loading}
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
                isReadOnly={loading}
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
                isReadOnly={loading || skuOption === "auto"}
                isInvalid={errors.sku}
                isRequired
              >
                <FormLabel htmlFor="sku">SKU</FormLabel>
                <InputGroup>
                  <Input
                    id="sku"
                    {...register("sku", {
                      required: { value: true, message: "*Required!" },
                    })}
                    pr="40px"
                  />
                  <InputRightElement>
                    <SKUOptions name="skuOption" defaultValue="auto" />
                  </InputRightElement>
                </InputGroup>

                <FormErrorMessage>{errors?.sku?.message}</FormErrorMessage>
                <FormHelperText>
                  (Stock Keeping Unit) Unique Item Identifier
                </FormHelperText>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[12, 6]}>
              <FormControl
                isReadOnly={loading}
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
                <FormErrorMessage>{errors?.unit?.message}</FormErrorMessage>
                <FormHelperText>
                  Select or type in your custom unit.
                </FormHelperText>
              </FormControl>
            </GridItem>
            <GridItem colSpan={[12, 6]}>
              <FormControl isReadOnly={loading} isInvalid={errors.costPrice}>
                <FormLabel htmlFor="costPrice">Cost Price (ksh)</FormLabel>
                <NumInput
                  name="costPrice"
                  min={0}
                  rules={{
                    min: {
                      value: 0,
                      message: "Value should not be less than zero(0)!",
                    },
                  }}
                />

                <FormErrorMessage>
                  {errors?.costPrice?.message}
                </FormErrorMessage>
                <FormHelperText>Optional</FormHelperText>
              </FormControl>
            </GridItem>
          </Grid>

          <Flex pt={4} justify="center">
            <Button colorScheme="cyan" type="submit" isLoading={loading}>
              next
            </Button>
          </Flex>
        </Container>
      </FormProvider>
    </Container>
  );
}

ItemDetailsForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  defaultValues: PropTypes.object,
};

export default ItemDetailsForm;
