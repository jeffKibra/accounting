import { useMemo } from "react";
import PropTypes from "prop-types";
import { Stack, IconButton } from "@chakra-ui/react";
import { RiDeleteBin4Line, RiEdit2Line } from "react-icons/ri";

import CustomModal from "../../ui/CustomModal";
import CustomTable from "../CustomTable";
import InvoiceForm from "../../forms/Invoice/InvoiceForm";

function AddedItemsTable(props) {
  const { items, handleDelete, handleEdit } = props;
  // console.log({ items });

  const columns = useMemo(() => {
    return [
      { Header: "", accessor: "actions" },
      { Header: "Name", accessor: "displayName" },
      { Header: "Quantity", accessor: "quantity" },
      { Header: "Rate", accessor: "sellingPrice" },
      { Header: "Discount", accessor: "discount" },
      { Header: "Tax", accessor: "tax" },
      { Header: "Amount", accessor: "amount" },
    ];
  }, []);

  const data = useMemo(() => {
    return items.map((item) => {
      const { itemId, name, variant, tax, discount, discountType } = item;

      return {
        ...item,
        displayName: `${name}-${variant}`,
        discount: `${discount} (${discountType})`,
        tax: tax?.name ? `${tax?.name} (${tax?.rate}%)` : "",
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
                  <InvoiceForm
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
        PropTypes.string,
      ]),
      amount: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ),
  handleDelete: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
};

export default AddedItemsTable;
