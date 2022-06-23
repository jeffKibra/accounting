import { useMemo } from "react";
import PropTypes from "prop-types";
import { Stack, IconButton } from "@chakra-ui/react";
import { RiDeleteBin4Line, RiEdit2Line } from "react-icons/ri";

import CustomTable from "../CustomTable";
import CustomModal from "../../ui/CustomModal";
import ExpenseItemDetailsForm from "../../forms/Expenses/ExpenseItemDetailsForm";

function ExpenseItemsTable(props) {
  const { items, handleDelete, handleEdit, loading, taxes } = props;

  const columns = useMemo(() => {
    return [
      { Header: "", accessor: "actions", width: "11%" },
      { Header: "Details", accessor: "details" },
      { Header: "Account", accessor: "account.name", width: "11%" },
      { Header: "Tax", accessor: "tax", width: "11%" },
      { Header: "Amount", accessor: "amount", width: "11%", isNumeric: true },
    ];
  }, []);

  const data = useMemo(() => {
    return [...items].map((item, index) => {
      const { tax } = item;

      return {
        ...item,
        tax: tax?.name ? `${tax?.name} (${tax?.rate}%)` : "",
        actions: (
          <Stack direction="row" spacing={1}>
            <CustomModal
              closeOnOverlayClick={false}
              title="Edit Expense"
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
                  <ExpenseItemDetailsForm
                    handleFormSubmit={(data) => handleEdit(data, index)}
                    expense={item}
                    onClose={onClose}
                    taxes={taxes}
                  />
                );
              }}
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
  }, [items, handleDelete, handleEdit, loading, taxes]);

  return <CustomTable data={data} columns={columns} />;
}

ExpenseItemsTable.propTypes = {
  loading: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      details: PropTypes.string.isRequired,
      account: PropTypes.object.isRequired,
      amount: PropTypes.number.isRequired,
      tax: PropTypes.shape({
        name: PropTypes.string,
        rate: PropTypes.number,
        taxId: PropTypes.string,
      }),
    })
  ),
  handleDelete: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  taxes: PropTypes.array.isRequired,
};

export default ExpenseItemsTable;
