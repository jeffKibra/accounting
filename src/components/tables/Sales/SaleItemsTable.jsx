import { useMemo } from "react";
import PropTypes from "prop-types";
import { Stack, IconButton } from "@chakra-ui/react";
import { RiDeleteBin4Line, RiEdit2Line } from "react-icons/ri";

import CustomTable from "../CustomTable";
// import CustomModal from "../../ui/CustomModal";
// import SelectItemForm from "../../forms/Sales/SelectItemForm";

function SaleItemsTable(props) {
  const { items, handleDelete, handleEdit, loading, taxType } = props;
  // console.log({ items });

  const columns = useMemo(() => {
    return [
      { Header: "", accessor: "actions" },
      { Header: "Name", accessor: "displayName" },
      { Header: "Quantity", accessor: "quantity", isNumeric: true },
      { Header: "Rate", accessor: "itemRate", isNumeric: true },
      { Header: "Tax", accessor: "tax", isNumeric: true },
      { Header: "Amount", accessor: "totalAmount", isNumeric: true },
    ];
  }, []);

  const data = useMemo(() => {
    return [...items].map((item, index) => {
      const {
        name,
        variant,
        salesTax,
        itemRateTotal,
        itemTaxTotal,
        itemRate,
        itemTax,
      } = item;

      const rate = taxType === "taxInclusive" ? itemRate + itemTax : itemRate;
      const amount =
        taxType === "taxInclusive"
          ? itemRateTotal + itemTaxTotal
          : itemRateTotal;

      return {
        ...item,
        itemRate: rate,
        totalAmount: amount,
        displayName: `${name}-${variant}`,
        tax: salesTax?.name ? `${salesTax?.name} (${salesTax?.rate}%)` : "",
        actions: (
          <Stack direction="row" spacing={1}>
            <IconButton
              size="xs"
              onClick={() => handleEdit(index)}
              colorScheme="cyan"
              icon={<RiEdit2Line />}
              title="Edit"
              isDisabled={loading}
            />

            <IconButton
              size="xs"
              onClick={() => handleDelete(index)}
              colorScheme="red"
              icon={<RiDeleteBin4Line />}
              title="Delete"
              isDisabled={loading}
            />
          </Stack>
        ),
      };
    });
  }, [items, handleDelete, handleEdit, loading, taxType]);

  return <CustomTable data={data} columns={columns} />;
}

SaleItemsTable.propTypes = {
  loading: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      variant: PropTypes.string,
      itemId: PropTypes.string.isRequired,
      rate: PropTypes.number.isRequired,
      tax: PropTypes.oneOfType([
        PropTypes.shape({
          name: PropTypes.string,
          rate: PropTypes.number,
          taxId: PropTypes.string,
        }),
      ]),
      itemRateTotal: PropTypes.number.isRequired,
      itemRate: PropTypes.number.isRequired,
      itemTax: PropTypes.number.isRequired,
      itemTaxTotal: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ),
  handleDelete: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  taxType: PropTypes.string.isRequired,
};

export default SaleItemsTable;
