import { useMemo } from "react";
import PropTypes from "prop-types";
import { Stack, IconButton } from "@chakra-ui/react";
import { RiDeleteBin4Line, RiEdit2Line } from "react-icons/ri";

import formats from "../../../utils/formats";

import CustomRawTable from "../CustomRawTable";
import CustomModal from "../../ui/CustomModal";
import ExpenseItemDetailsForm from "../../forms/Expenses/ExpenseItemDetailsForm";

function ExpenseItemsTable(props) {
  const { items, handleDelete, handleEdit, loading, taxes, showActions } =
    props;

  const columns = useMemo(() => {
    return [
      ...(showActions
        ? [{ Header: "", accessor: "actions", width: "11%" }]
        : []),
      { Header: "Details", accessor: "details" },
      { Header: "Account", accessor: "account.name", width: "11%" },
      { Header: "Tax", accessor: "tax", width: "11%" },
      { Header: "Amount", accessor: "amount", width: "11%", isNumeric: true },
    ];
  }, [showActions]);

  const data = useMemo(() => {
    return [...items].map((item, index) => {
      const { tax, amount } = item;

      return {
        ...item,
        amount: formats.formatCash(amount),
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

  return <CustomRawTable data={data} columns={columns} />;
}

ExpenseItemsTable.defaultProps = {
  showActions: true,
};

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
  taxes: PropTypes.array.isRequired,
  showActions: PropTypes.bool.isRequired,
};

export default ExpenseItemsTable;
