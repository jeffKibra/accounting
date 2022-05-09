import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { NEW_INVOICE } from "../../../nav/routes";

import useSavedLocation from "../../../hooks/useSavedLocation";
import PageLayout from "../../../components/layout/PageLayout";

import Payments from "../../../containers/Management/PaymentsReceived/Payments";

function PaymentsPage() {
  useSavedLocation().setLocation();

  return (
    <PageLayout
      pageTitle="Invoices"
      actions={
        <Link to={NEW_INVOICE}>
          <Button colorScheme="cyan" size="sm" variant="outline">
            new invoice
          </Button>
        </Link>
      }
    >
      <Payments />
    </PageLayout>
  );
}

export default PaymentsPage;
