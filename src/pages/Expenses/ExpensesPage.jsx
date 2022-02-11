import { Link, useLocation } from "react-router-dom";
import { Button } from "@chakra-ui/react";

import Expenses from "../../containers/Expenses/Expenses";

import PageLayout from "../../components/layout/PageLayout";
function ExpensesPage() {
  const location = useLocation();
  return (
    <PageLayout
      pageTitle="Expenses"
      actions={
        <Link to={`${location.pathname}/new`}>
          <Button>New Expense</Button>
        </Link>
      }
    >
      <Expenses />
    </PageLayout>
  );
}

export default ExpensesPage;
