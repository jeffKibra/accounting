import { Button } from "@chakra-ui/react";
import { useLocation, Link } from "react-router-dom";

import PageLayout from "../../../components/layout/PageLayout";

import Taxes from "../../../containers/Management/Taxes/Taxes";

import useSavedLocation from "../../../hooks/useSavedLocation";

function TaxesPage() {
  const location = useLocation();
  useSavedLocation().setLocation();

  return (
    <PageLayout
      pageTitle="Taxes"
      actions={
        <Link to={`${location.pathname}/new`}>
          <Button variant="outline" colorScheme="cyan" size="sm">
            NEW TAX
          </Button>
        </Link>
      }
    >
      <Taxes />
    </PageLayout>
  );
}

export default TaxesPage;
