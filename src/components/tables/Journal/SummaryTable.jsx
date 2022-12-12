import { useEffect, useCallback } from 'react';
import { TableContainer, Table, Tbody, Td, Th, Tr } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
import BigNumber from 'bignumber.js';

function JournalSummaryTable(props) {
  const { summary } = props;
  const { control, getValues, watch, setValue } = useFormContext();

  const taxType = watch('summary.taxType');

  const { taxes } = summary;

  function getTotalAmount(subSummary) {
    console.log({ subSummary });
    const subTotal = new BigNumber(subSummary.subTotal || 0);
    const shipping = new BigNumber(subSummary.shipping || 0);
    const adjustment = new BigNumber(subSummary.adjustment || 0);

    return subTotal.plus(shipping).plus(adjustment).dp(2).toNumber();
  }

  const updateSummaryOnFieldBlur = useCallback(
    (fieldName, value, subSummary) => {
      //get current values
      const currentSummary = getValues('summary');

      const { shipping, adjustment } = currentSummary;
      let { taxes } = subSummary;
      let subTotal = new BigNumber(subSummary.subTotal);
      const totalTax = new BigNumber(subSummary.totalTax);
      const newSubTotal = subTotal.plus(totalTax);

      subTotal = taxType === 'taxInclusive' ? newSubTotal : subTotal;

      const totalAmount = getTotalAmount({
        subTotal: newSubTotal.dp(2).toNumber(),
        shipping,
        adjustment,
        /**
         * field name could be either shipping or adjustment
         * add value at the bottom to override if present
         */
        ...(fieldName ? { [fieldName]: value } : {}),
      });

      //update whole summary
      setValue('summary', {
        ...currentSummary,
        subTotal: subTotal.dp(2).toNumber(),
        totalTax: totalTax.dp(2).toNumber(),
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
            <Controller
              name="summary.subTotal"
              control={control}
              render={({ field: { value } }) => {
                return (
                  <Td w="16%" isNumeric>
                    {value}
                  </Td>
                );
              }}
            />
          </Tr>

          {/**
           * add taxes to form but hide from view-returns nothing
           */}
          <Controller
            name="summary.taxes"
            control={control}
            render={() => <></>}
          />
          {taxes.map((tax, i) => {
            const { name, rate, totalTax } = tax;
            return (
              <Tr key={i}>
                <Td>
                  {' '}
                  {name} ({rate}%)
                </Td>
                <Td isNumeric>{totalTax}</Td>
              </Tr>
            );
          })}

          {/**
           * add totalTax to form but hide from view-returns nothing
           */}
          <Controller
            name="summary.totalTax"
            control={control}
            rules={{
              required: { value: true, message: 'Required' },
              min: { value: 0, message: 'Value should be a positive number' },
            }}
            render={() => <></>}
          />

          <Tr>
            <Th>Total (KES)</Th>
            <Controller
              name="summary.totalAmount"
              rules={{
                required: { value: true, message: 'Required' },
                min: {
                  value: 0,
                  message: 'Value should be a positive number',
                },
              }}
              render={({ field: { value } }) => {
                return (
                  <Th fontSize="16px" w="16%" py={3} isNumeric>
                    {value}
                  </Th>
                );
              }}
            />

            {/* <Th isNumeric>{totalAmount}</Th> */}
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
}

JournalSummaryTable.propTypes = {
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

export default JournalSummaryTable;

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
