import { Link, useLocation } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import { RiAddLine } from "react-icons/ri";

import { useSavedLocation } from "../../../hooks";

import Expenses from "../../../containers/Management/Expenses/Expenses";

import PageLayout from "../../../components/layout/PageLayout";

function ExpensesPage() {
  useSavedLocation().setLocation();
  const location = useLocation();

  return (
    <PageLayout
      pageTitle="Expenses"
      actions={
        <Link to={`${location.pathname}/new`}>
          <Button
            colorScheme="cyan"
            variant="outline"
            size="sm"
            rightIcon={<RiAddLine />}
          >
            New
          </Button>
        </Link>
      }
    >
      <Expenses />
    </PageLayout>
  );
}

export default ExpensesPage;
