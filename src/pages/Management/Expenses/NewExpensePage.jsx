import { Link } from "react-router-dom";
import { IconButton } from "@chakra-ui/react";
import { RiCloseLine } from "react-icons/ri";

import PageLayout from "../../../components/layout/PageLayout";
import NewExpense from "../../../containers/Management/Expenses/NewExpense";

function NewExpensePage() {
  return (
    <PageLayout
      pageTitle="New Expense"
      actions={
        <Link to={-1}>
          <IconButton
            colorScheme="red"
            variant="outline"
            size="sm"
            title="cancel"
            icon={<RiCloseLine />}
          />
        </Link>
      }
    >
      <NewExpense />
    </PageLayout>
  );
}

export default NewExpensePage;
