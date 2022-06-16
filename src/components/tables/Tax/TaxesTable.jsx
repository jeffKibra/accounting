import { useMemo } from "react";
import PropTypes from "prop-types";

import TaxOptions from "../../../containers/Management/Taxes/TaxOptions";

import CustomTable from "../CustomTable";

function TaxesTable(props) {
  const { taxes } = props;
  // console.log({ taxes });

  const columns = useMemo(() => {
    return [
      { Header: "", accessor: "actions" },
      { Header: "Name", accessor: "name" },
      { Header: "Rate", accessor: "rate" },
      { Header: "Status", accessor: "status" },
      { Header: "Date Created", accessor: "createdAt" },
    ];
  }, []);

  const data = useMemo(() => {
    return taxes.map((tax) => {
      const { createdAt } = tax;

      return {
        ...tax,
        createdAt: new Date(createdAt.seconds * 1000).toDateString(),
        actions: <TaxOptions tax={tax} edit deletion />,
      };
    });
  }, [taxes]);

  return <CustomTable data={data} columns={columns} />;
}

TaxesTable.propTypes = {
  taxes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      rate: PropTypes.number.isRequired,
      taxId: PropTypes.string.isRequired,
    })
  ),
  deleting: PropTypes.bool.isRequired,
  isDeleted: PropTypes.bool.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default TaxesTable;
