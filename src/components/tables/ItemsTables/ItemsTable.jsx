import { useMemo } from "react";
import PropTypes from "prop-types";
import { Box, Text } from "@chakra-ui/react";

import CustomTable from "../CustomTable";
import TableActions from "../TableActions";

function ItemsTable(props) {
  const { items, deleting, isDeleted, handleDelete } = props;
  // console.log({ items });

  const columns = useMemo(() => {
    return [
      { Header: "", accessor: "actions" },
      { Header: "Name", accessor: "name" },
      { Header: "Variant", accessor: "variant" },
      { Header: "Type", accessor: "type" },
      { Header: "Rate", accessor: "sellingPrice" },
      { Header: "Cost", accessor: "costPrice" },
    ];
  }, []);

  const data = useMemo(() => {
    return items.map((item) => {
      const { itemId, name, variant } = item;

      function onDelete() {
        console.log({ itemId });
        handleDelete({
          itemId,
          status: "deleted",
        });
      }

      return {
        ...item,
        actions: (
          <TableActions
            editRoute={`${itemId}/edit`}
            deleteDialog={{
              isDeleted: isDeleted,
              title: "Delete Item",
              onConfirm: onDelete,
              loading: deleting,
              message: (
                <Box>
                  <Text>Are you sure you want to delete this ITEM</Text>
                  <Box p={1} pl={5}>
                    <Text>
                      Item ID: <b>{itemId}</b>
                    </Text>
                    <Text>
                      Item Name: <b>{name}</b>
                    </Text>
                    <Text>
                      Item Variant: <b>{variant}</b>
                    </Text>
                  </Box>
                  <Text>NOTE:::THIS ACTION CANNOT BE UNDONE!</Text>
                </Box>
              ),
            }}
          />
        ),
      };
    });
  }, [items, deleting, isDeleted, handleDelete]);

  return <CustomTable data={data} columns={columns} />;
}

ItemsTable.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      variant: PropTypes.string,
      itemId: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["goods", "service"]).isRequired,
      costPrice: PropTypes.number.isRequired,
      sellingPrice: PropTypes.number.isRequired,
    })
  ),
  deleting: PropTypes.bool.isRequired,
  isDeleted: PropTypes.bool.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default ItemsTable;
