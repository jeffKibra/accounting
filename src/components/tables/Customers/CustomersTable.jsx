import { useMemo } from "react";
import PropTypes from "prop-types";

import CustomerOptions from "../../../containers/Management/Customers/CustomerOptions";

import CustomTable from "../CustomTable";

function CustomersTable(props) {
  const { customers } = props;
  // console.log({ customers });

  const columns = useMemo(() => {
    return [
      { Header: "", accessor: "actions" },
      { Header: "Name", accessor: "displayName" },
      { Header: "Company Name", accessor: "companyName" },
      { Header: "Email", accessor: "email" },
      { Header: "Phone", accessor: "phone" },
      {
        Header: "Opening Balance",
        accessor: "openingBalance",
        isNumeric: true,
      },
    ];
  }, []);

  const data = useMemo(() => {
    return customers.map((customer) => {
      return {
        ...customer,
        actions: <CustomerOptions customer={customer} edit view deletion />,
      };
    });
  }, [customers]);

  return <CustomTable data={data} columns={columns} />;
}

CustomersTable.propTypes = {
  customers: PropTypes.arrayOf(
    PropTypes.shape({
      displayName: PropTypes.string.isRequired,
      companyName: PropTypes.string,
      customerId: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["individual", "business"]).isRequired,
      phone: PropTypes.string.isRequired,
      email: PropTypes.string,
      openingBalance: PropTypes.number,
    })
  ),
  deleting: PropTypes.bool.isRequired,
  isDeleted: PropTypes.bool.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default CustomersTable;
