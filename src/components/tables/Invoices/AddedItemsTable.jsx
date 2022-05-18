import { useMemo } from "react";
import PropTypes from "prop-types";
import { Stack, IconButton, Text } from "@chakra-ui/react";
import { RiDeleteBin4Line, RiEdit2Line } from "react-icons/ri";

import CustomModal from "../../ui/CustomModal";
import CustomTable from "../CustomTable";
import ItemQtyForm from "../../forms/Invoice/ItemQtyForm";

function AddedItemsTable(props) {
  const { items, handleDelete, handleEdit } = props;
  // console.log({ items });

  const columns = useMemo(() => {
    return [
      { Header: "", accessor: "actions" },
      { Header: "Name", accessor: "displayName" },
      { Header: "Quantity", accessor: "quantity" },
      { Header: "Rate", accessor: "rate" },
      { Header: "Discount", accessor: "discount" },
      { Header: "Tax", accessor: "tax" },
      { Header: "Amount", accessor: "totalAmount" },
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
            />
          </Stack>
        ),
      };
    });
  }, [items, handleDelete, handleEdit]);

  return <CustomTable data={data} columns={columns} />;
}

AddedItemsTable.propTypes = {
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
