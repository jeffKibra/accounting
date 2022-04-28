import { Link, useLocation } from "react-router-dom";
import { Button } from "@chakra-ui/react";

import PageLayout from "../../../components/layout/PageLayout";

import useSavedLocation from "../../../hooks/useSavedLocation";

import Customers from "../../../containers/Management/Customers/Customers";

function CustomersPage() {
  useSavedLocation().setLocation();
  const location = useLocation();

  return (
    <PageLayout
      pageTitle="Customers"
      actions={
        <Link to={`${location.pathname}/new`}>
          <Button variant="outline" colorScheme="cyan" size="sm">
            new customer
          </Button>
        </Link>
      }
    >
      <Customers />
    </PageLayout>
  );
}

export default CustomersPage;
