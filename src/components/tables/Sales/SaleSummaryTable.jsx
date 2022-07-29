import { useEffect, useState } from "react";
import {
  TableContainer,
  Table,
  Tbody,
  Td,
  Th,
  Tr,
  VisuallyHidden,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { Controller, useFormContext } from "react-hook-form";

import TableNumInput from "../../ui/TableNumInput";

function SaleSummaryTable(props) {
  const { summary, loading } = props;
  const { taxes } = summary;

  const { control, setValue, watch } = useFormContext();

  const taxType = watch("summary.taxType");
  const shipping = watch("summary.shipping");
  const adjustment = watch("summary.adjustment");
  /**
   * update summary values
   */
  useEffect(() => {
    console.log("updating summary values");
    let { subTotal, totalTax, taxes } = summary;
    const newSubTotal = subTotal + totalTax;

    subTotal = taxType === "taxInclusive" ? newSubTotal : subTotal;
    const totalAmount = newSubTotal + +shipping + +adjustment;

    setValue("summary.subTotal", subTotal, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("summary.taxes", taxes, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("summary.totalTax", totalTax, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("summary.totalAmount", totalAmount, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [setValue, taxType, summary, shipping, adjustment]);

  return (
    <TableContainer>
      <Table size="sm">
        <Tbody>
          <Tr>
            <Td>Sub Total</Td>
            <Th w="16%" isNumeric>
              <TableNumInput
                name="summary.subTotal"
                min={0}
                isReadOnly
                rules={{
                  required: { value: true, message: "Required" },
                  min: {
                    value: 0,
                    message: "Value should be a positive number",
                  },
                }}
              />
            </Th>
          </Tr>

          <Tr>
            <Td>Shipping Charges </Td>
            <Th w="16%" isNumeric>
              <TableNumInput
                name="summary.shipping"
                min={0}
                isReadOnly={loading}
              />
            </Th>
          </Tr>

          {taxes.map((tax, i) => {
            const { name, rate, totalTax } = tax;
            return (
              <Tr key={i}>
                <Td>
                  {" "}
                  {name} ({rate}%)
                </Td>
                <Td isNumeric>{totalTax}</Td>
              </Tr>
            );
          })}

          <Tr>
            <Td>Adjustments </Td>
            <Th w="16%" isNumeric>
              <Controller
                name="summary.adjustment"
                control={control}
                render={({ field: { onBlur, value, ref, onChange } }) => {
                  function updateValue(val) {
                    console.log({ val });
                    onChange(val);

                    onBlur();
                  }

                  return <OnBlurNumInput updateValue={updateValue} />;
                }}
              />
              {/* <TableNumInput name="summary.adjustment" isReadOnly={loading} /> */}
            </Th>
          </Tr>

          {/* <VisuallyHidden>
            {/**
             * add totalTax to form but hide from view
             */}
          {/* <Controller
              name="summary.totalTax"
              control={control}
              rules={{
                required: { value: true, message: "Required" },
                min: { value: 0, message: "Value should be a positive number" },
              }}
              render={() => <></>}
            />
          </VisuallyHidden> */}

          {/* <VisuallyHidden>
            {/**
             * add taxes to form but hide from view
             */}
          {/* <Controller
              name="summary.taxes"
              control={control}
              rules={{ required: { value: true, message: "Required" } }}
              render={() => <></>}
            />
          </VisuallyHidden> */}

          <Tr>
            <Th>Total (KES)</Th>
            <Th w="16%" isNumeric>
              <TableNumInput
                name="summary.totalAmount"
                isReadOnly
                rules={{
                  required: { value: true, message: "Required" },
                  min: {
                    value: 0,
                    message: "Value should be a positive number",
                  },
                }}
              />
            </Th>
            {/* <Th isNumeric>{totalAmount}</Th> */}
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
}

SaleSummaryTable.propTypes = {
  loading: PropTypes.bool.isRequired,
  summary: PropTypes.shape({
    subTotal: PropTypes.number,
    taxes: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        rate: PropTypes.number,
        taxId: PropTypes.string,
        totalTax: PropTypes.number,
      })
    ),
    totalTaxes: PropTypes.number,
  }),
  taxType: PropTypes.string.isRequired,
};

export default SaleSummaryTable;

function OnBlurNumInput(props) {
  const { updateValue } = props;
  const [value, setValue] = useState(0);

  function handleChange(inputValue) {
    console.log({ inputValue });
    setValue(inputValue);
  }

  function handleBlur() {
    updateValue(value);
  }

  return (
    <NumberInput
      onChange={handleChange}
      onBlur={handleBlur}
      value={value}
      min={0}
      // defaultValue={defaultValue || 0}
      size="sm"
      // isReadOnly={isReadOnly}
      // isDisabled={isDisabled}
    >
      <NumberInputField
        minW="90px"
        textAlign="right"
        pl="8px!important"
        pr="8px!important"
        // {...register(name, {
        //   valueAsNumber: true,
        //   ...(rules ? rules : {}),
        // })}
      />
    </NumberInput>
  );
}

// <GridItem colSpan={7}>
//           <FormControl isInvalid={errors.discount}>
//             <FormLabel htmlFor="discount">Discount</FormLabel>
//             <NumInput name="discount" min={0} />
//             <FormErrorMessage>{errors.discount?.message}</FormErrorMessage>
//           </FormControl>
//         </GridItem>

//         <GridItem colSpan={5}>
//           <FormControl isInvalid={errors.discountType}>
//             <FormLabel htmlFor="discountType">Discount Type</FormLabel>
//             <Select
//               id="discountType"
//               defaultValue="KES"
//               {...register("discountType")}
//             >
//               <option value="KES">KES</option>
//               <option value="%">%</option>
//             </Select>
//             <FormErrorMessage>
//               {errors.discountType?.message}
//             </FormErrorMessage>
//           </FormControl>
//         </GridItem>
