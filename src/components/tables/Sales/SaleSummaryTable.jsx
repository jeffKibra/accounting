import { useEffect, useCallback } from 'react';
import { TableContainer, Table, Tbody, Td, Th, Tr } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
import BigNumber from 'bignumber.js';

function SaleSummaryTable(props) {
  const { control, watch, setValue } = useFormContext();

  // const taxType = watch('taxType');
  const bookingRate = watch('bookingRate');
  const transferAmount = watch('transferAmount');
  const saleTax = watch('saleTax');

  const selectedDates = watch('selectedDates');
  const quantity = selectedDates?.length;

  // console.log({ bookingRate, quantity, transferAmount, saleTax });

  // console.log({ bookingRate, quantity, transferAmount, saleTax });

  const updateTotals = useCallback(
    (bookingRate, quantity, transferAmount) => {
      console.log('caculating totals', {
        bookingRate,
        quantity,
        transferAmount,
      });
      //get current values

      // let { taxes } = subSummary;
      const bookingTotal = new BigNumber(bookingRate).times(quantity);
      let subTotal = bookingTotal.plus(transferAmount);

      // const totalTax = new BigNumber(subSummary.totalTax);
      // const newbookingTotal = bookingTotal.plus(totalTax);
      // if (taxType) {
      //   bookingTotal =
      //     taxType === 'taxInclusive' ? newbookingTotal : bookingTotal;
      // }

      const total = subTotal;

      // console.log({
      //   bookingTotal: bookingTotal.dp(2).toNumber(),
      //   subTotal,
      //   total,
      // });

      //update whole summary
      setValue('bookingTotal', bookingTotal.dp(2).toNumber());
      setValue('subTotal', subTotal.dp(2).toNumber());
      setValue('total', total.dp(2).toNumber());
    },
    [setValue]
  );

  // const bookingTotal = watch('bookingTotal');
  // console.log({ bookingTotal });

  useEffect(() => {
    updateTotals(bookingRate, quantity, transferAmount);
  }, [updateTotals, bookingRate, quantity, transferAmount]);

  return (
    <TableContainer>
      <Table>
        <Tbody>
          <Tr>
            <Td>Sub Total</Td>
            <Controller
              name="subTotal"
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

          <Controller
            name="bookingTotal"
            control={control}
            render={() => <></>}
          />

          {/**
           * add taxes to form but hide from view-returns nothing
           */}

          {saleTax
            ? (() => {
                const { name, rate, totalTax } = saleTax;
                return (
                  <Tr>
                    <Td>
                      {' '}
                      {name} ({rate}%)
                    </Td>
                    <Td isNumeric>{totalTax}</Td>
                  </Tr>
                );
              })()
            : null}

          <Tr>
            <Th fontSize="16px">Total (KES)</Th>
            <Controller
              name="total"
              rules={{
                required: { value: true, message: 'Required' },
                min: {
                  value: 0,
                  message: 'Value should be a positive number',
                },
              }}
              render={({ field: { value } }) => {
                return (
                  <Th fontSize="16px" w="16%" isNumeric>
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

SaleSummaryTable.propTypes = {
  loading: PropTypes.bool.isRequired,
  summary: PropTypes.shape({
    bookingTotal: PropTypes.number,
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
