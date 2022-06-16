import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { NEW_PAYMENT } from "../../../nav/routes";

import useSavedLocation from "../../../hooks/useSavedLocation";
import PageLayout from "../../../components/layout/PageLayout";

import Payments from "../../../containers/Management/Payments/Payments";

function PaymentsPage() {
  useSavedLocation().setLocation();

  return (
    <PageLayout
      pageTitle="Payments Received"
      actions={
        <Link to={NEW_PAYMENT}>
          <Button colorScheme="cyan" size="sm" variant="outline">
            new payment
          </Button>
        </Link>
      }
    >
      <Payments />
    </PageLayout>
  );
}

export default PaymentsPage;
