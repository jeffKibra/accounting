import { useMemo } from "react";
import PropTypes from "prop-types";
import { Stack, IconButton, Text } from "@chakra-ui/react";
import { RiDeleteBin4Line, RiEdit2Line } from "react-icons/ri";

import CustomTable from "../CustomTable";
import CustomModal from "../../ui/CustomModal";
import ItemQtyForm from "../../forms/Invoice/ItemQtyForm";

function AddedItemsTable(props) {
  const { items, handleDelete, handleEdit, loading } = props;
  // console.log({ items });

  const columns = useMemo(() => {
    return [
      { Header: "", accessor: "actions" },
      { Header: "Name", accessor: "displayName" },
      { Header: "Quantity", accessor: "quantity", isNumeric: true },
      { Header: "Rate", accessor: "rate", isNumeric: true },
      { Header: "Discount", accessor: "discount", isNumeric: true },
      { Header: "Tax", accessor: "tax", isNumeric: true },
      { Header: "Amount", accessor: "totalAmount", isNumeric: true },
    ];
  }, []);

  const data = useMemo(() => {
    return items.map((item) => {
      const {
        itemId,
        name,
        variant,
        salesTax,
        salesTaxType,
        discount,
        discountType,
      } = item;

      return {
        ...item,
        displayName: `${name}-${variant}`,
        discount: `${discount} (${discountType})`,
        tax: salesTax?.name ? (
          <>
            {salesTax?.name} ({salesTax?.rate}%)
            <br />
            <Text color="gray.600" textTransform="capitalize" fontSize="xs">
              {salesTaxType}
            </Text>
          </>
        ) : (
          ""
        ),
        actions: (
          <Stack direction="row" spacing={1}>
            <CustomModal
              closeOnOverlayClick={false}
              title="Edit Item"
              renderTrigger={(onOpen) => {
                return (
                  <IconButton
                    size="xs"
                    onClick={onOpen}
                    colorScheme="cyan"
                    icon={<RiEdit2Line />}
                    title="Edit"
                    isDisabled={loading}
                  />
                );
              }}
              renderContent={(onClose) => {
                return (
                  <ItemQtyForm
                    handleFormSubmit={handleEdit}
                    items={items}
                    item={item}
                    onClose={onClose}
                  />
                );
              }}
            />

            <IconButton
              size="xs"
              onClick={() => handleDelete(itemId)}
              colorScheme="red"
              icon={<RiDeleteBin4Line />}
              title="Delete"
              isDisabled={loading}
            />
          </Stack>
        ),
      };
    });
  }, [items, handleDelete, handleEdit, loading]);

  return <CustomTable data={data} columns={columns} />;
}

AddedItemsTable.propTypes = {
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
      totalAmount: PropTypes.number.isRequired,
      taxExclusiveAmount: PropTypes.number.isRequired,
      totalTax: PropTypes.number.isRequired,
      totalDiscount: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ),
  handleDelete: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
};

export default AddedItemsTable;
