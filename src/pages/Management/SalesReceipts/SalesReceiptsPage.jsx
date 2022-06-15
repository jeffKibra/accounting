import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { RiAddLine } from "react-icons/ri";

import { NEW_SALES_RECEIPT } from "../../../nav/routes";

import useSavedLocation from "../../../hooks/useSavedLocation";
import PageLayout from "../../../components/layout/PageLayout";

import SalesReceipts from "../../../containers/Management/SalesReceipts/SalesReceipts";

function SalesReceiptsPage() {
  useSavedLocation().setLocation();

  return (
    <PageLayout
      pageTitle="Sales Receipts"
      actions={
        <Link to={NEW_SALES_RECEIPT}>
          <Button
            colorScheme="cyan"
            size="sm"
            variant="outline"
            rightIcon={<RiAddLine />}
          >
            new
          </Button>
        </Link>
      }
    >
      <SalesReceipts />
    </PageLayout>
  );
}

export default SalesReceiptsPage;
