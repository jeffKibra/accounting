import { useMemo } from "react";
import PropTypes from "prop-types";
import { Box, Text } from "@chakra-ui/react";

import CustomTable from "../CustomTable";
import TableActions from "../TableActions";

function TaxesTable(props) {
  const { taxes, deleting, isDeleted, handleDelete } = props;
  // console.log({ taxes });

  const columns = useMemo(() => {
    return [
      { Header: "", accessor: "actions" },
      { Header: "Name", accessor: "name" },
      { Header: "Rate", accessor: "rate" },
    ];
  }, []);

  const data = useMemo(() => {
    return taxes.map((tax) => {
      const { taxId, name, rate } = tax;

      return {
        ...tax,
        actions: (
          <TableActions
            editRoute={`${taxId}/edit`}
            deleteDialog={{
              isDeleted: isDeleted,
              title: "Delete Tax",
              onConfirm: () => handleDelete(taxId),
              loading: deleting,
              message: (
                <Box>
                  <Text>Are you sure you want to delete this Tax</Text>
                  <Box p={1} pl={5}>
                    <Text>
                      Tax Name: <b>{name}</b>
                    </Text>
                    <Text>
                      Tax Rate: <b>{rate}</b>
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
  }, [taxes, deleting, isDeleted, handleDelete]);

  return <CustomTable data={data} columns={columns} />;
}

TaxesTable.propTypes = {
  taxes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      rate: PropTypes.string,
      taxId: PropTypes.string.isRequired,
    })
  ),
  deleting: PropTypes.bool.isRequired,
  isDeleted: PropTypes.bool.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default TaxesTable;
