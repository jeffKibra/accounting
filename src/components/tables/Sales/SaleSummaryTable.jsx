import { TableContainer, Table, Tbody, Td, Th, Tr } from "@chakra-ui/react";
import PropTypes from "prop-types";

import TableNumInput from "../../ui/TableNumInput";

function SaleSummaryTable(props) {
  const { summary, loading, taxType, totalAmount } = props;
  const { subTotal, taxes, totalTax } = summary;

  return (
    <TableContainer>
      <Table size="sm">
        <Tbody>
          <Tr>
            <Td>Sub Total</Td>
            <Td isNumeric>
              {taxType === "taxInclusive" ? subTotal + totalTax : subTotal}
            </Td>
          </Tr>

          <Tr>
            <Td>Shipping Charges </Td>
            <Td w="16%" isNumeric>
              <TableNumInput name="shipping" min={0} loading={loading} />
            </Td>
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
            <Td w="16%" isNumeric>
              <TableNumInput name="adjustment" loading={loading} />
            </Td>
          </Tr>

          <Tr>
            <Th>Total (KES)</Th>
            <Th isNumeric>{totalAmount}</Th>
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
