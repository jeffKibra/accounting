import { useMemo } from "react";
import PropTypes from "prop-types";
import { Box, Text } from "@chakra-ui/react";

import CustomTable from "../CustomTable";
import TableActions from "../TableActions";

function CustomersTable(props) {
  const { customers, deleting, isDeleted, handleDelete } = props;
  // console.log({ customers });

  const columns = useMemo(() => {
    return [
      { Header: "", accessor: "actions" },
      { Header: "Name", accessor: "displayName" },
      { Header: "Company Name", accessor: "companyName" },
      { Header: "Email", accessor: "email" },
      { Header: "Work Phone", accessor: "workPhone" },
      {
        Header: "Opening Balance",
        accessor: "openingBalance",
        isNumeric: true,
      },
    ];
  }, []);

  const data = useMemo(() => {
    return customers.map((customer) => {
      const { customerId, displayName, type } = customer;

      return {
        ...customer,
        actions: (
          <TableActions
            editRoute={`${customerId}/edit`}
            deleteDialog={{
              isDeleted: isDeleted,
              title: "Delete Customer",
              onConfirm: () => handleDelete(customerId),
              loading: deleting,
              message: (
                <Box>
                  <Text>Are you sure you want to delete this Customer</Text>
                  <Box p={1} pl={5}>
                    <Text>
                      Customer ID: <b>{customerId}</b>
                    </Text>
                    <Text>
                      Customer Name: <b>{displayName}</b>
                    </Text>
                    <Text>
                      Customer Type: <b>{type}</b>
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
  }, [customers, deleting, isDeleted, handleDelete]);

  return <CustomTable data={data} columns={columns} />;
}

CustomersTable.propTypes = {
  customers: PropTypes.arrayOf(
    PropTypes.shape({
      displayName: PropTypes.string.isRequired,
      companyName: PropTypes.string,
      customerId: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["individual", "business"]).isRequired,
      workPhone: PropTypes.string.isRequired,
      email: PropTypes.string,
      openingBalance: PropTypes.number,
    })
  ),
  deleting: PropTypes.bool.isRequired,
  isDeleted: PropTypes.bool.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default CustomersTable;
