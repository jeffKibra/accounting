import { useEffect, useCallback } from "react";
import { TableContainer, Table, Tbody, Td, Th, Tr } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { Controller, useFormContext } from "react-hook-form";

import TableNumInput from "../../ui/TableNumInput";
import RHFPlainNumInput from "components/ui/RHFPlainNumInput";

function SaleSummaryTable(props) {
  const { loading, summary } = props;
  const { control, getValues, watch, setValue } = useFormContext();

  const taxType = watch("summary.taxType");

  const { taxes } = summary;

  function getTotalAmount(subSummary) {
    const { subTotal, shipping, adjustment } = subSummary;

    return subTotal + +shipping + +adjustment;
  }

  const updateSummaryOnFieldBlur = useCallback(
    (fieldName, value, subSummary) => {
      //get current values
      const currentSummary = getValues("summary");

      const { shipping, adjustment } = currentSummary;
      let { subTotal, totalTax, taxes } = subSummary;
      const newSubTotal = subTotal + totalTax;

      subTotal = taxType === "taxInclusive" ? newSubTotal : subTotal;

      const totalAmount = getTotalAmount({
        subTotal: newSubTotal,
        shipping,
        adjustment,
        /**
         * field name could be either shipping or adjustment
         * add value at the bottom to override if present
         */
        ...(fieldName ? { [fieldName]: value } : {}),
      });

      //update whole summary
      setValue("summary", {
        ...currentSummary,
        subTotal,
        totalTax,
        taxes,
        totalAmount,
        ...(fieldName ? { [fieldName]: value } : {}),
      });
    },
    [getValues, setValue, taxType]
  );

  useEffect(() => {
    /**
     * update summary values by calling function with null field values
     */
    updateSummaryOnFieldBlur(null, null, summary);
  }, [summary, updateSummaryOnFieldBlur]);

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
              <RHFPlainNumInput
                name="summary.shipping"
                mode="onBlur"
                updateValueOnBlur={false}
                min={0}
                isReadOnly={loading}
                onBlur={(value) =>
                  updateSummaryOnFieldBlur("shipping", value, summary)
                }
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
              <RHFPlainNumInput
                name="summary.adjustment"
                mode="onBlur"
                updateValueOnBlur={false}
                rules={{
                  min: 0,
                }}
                min={0}
                onBlur={(value) =>
                  updateSummaryOnFieldBlur("adjustment", value, summary)
                }
                isReadOnly={loading}
              />
            </Th>
          </Tr>

          {/**
           * add totalTax to form but hide from view-returns nothing
           */}
          <Controller
            name="summary.totalTax"
            control={control}
            rules={{
              required: { value: true, message: "Required" },
              min: { value: 0, message: "Value should be a positive number" },
            }}
            render={() => <></>}
          />

          {/**
           * add taxes to form but hide from view-returns nothing
           */}
          <Controller
            name="summary.taxes"
            control={control}
            rules={{ required: { value: true, message: "Required" } }}
            render={() => <></>}
          />

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
    totalTax: PropTypes.number,
  }),
};

export default SaleSummaryTable;

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
