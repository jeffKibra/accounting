import { Link, Button } from "@chakra-ui/react";

import PageLayout from "../../../components/layout/PageLayout";

import Taxes from "../../../containers/Management/Taxes/Taxes";

function TaxesPage() {
  return (
    <PageLayout
      pageTitle="Taxes"
      actions={
        <Link to="new">
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
