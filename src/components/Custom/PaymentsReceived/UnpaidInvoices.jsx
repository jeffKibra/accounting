import { useEffect, useState, useContext } from "react";
import { connect } from "react-redux";
import { Flex, Grid, GridItem, Button } from "@chakra-ui/react";

import PaymentsContext from "../../../contexts/PaymentsContext";
import StepperContext from "../../../contexts/StepperContext";

import SkeletonLoader from "../../ui/SkeletonLoader";
import Empty from "../../ui/Empty";

import UnpaidInvoicesTable from "../../tables/Invoices/UnpaidInvoicesTable";
import PaymentsSummaryTable from "../../tables/PaymentsReceived/PaymentsSummaryTable";

function UnpaidInvoices(props) {
  console.log({ props });
  const {
    paymentId,
    autoPay,
    editInvoicePayment,
    loadingInvoices,
    invoices,
    summary,
    formValues,
  } = useContext(PaymentsContext);
  const { prevStep } = useContext(StepperContext);

  console.log({ formValues });
  const { taxDeducted } = formValues;

  function goBack() {
    prevStep();
  }

  console.log({ summary, invoices });

  return loadingInvoices ? (
    <SkeletonLoader />
  ) : (
    <>
      <Grid mt={2} w="full" gap={2} templateColumns="repeat(12, 1fr)">
        <GridItem colSpan={12}>
          <UnpaidInvoicesTable
            autoPay={autoPay}
            editInvoicePayment={editInvoicePayment}
            taxDeducted={taxDeducted}
            invoices={invoices}
            paymentId={paymentId}
            summary={summary}
          />
        </GridItem>
        <GridItem colSpan={[1, 6]} />
        <GridItem
          colSpan={[11, 6]}
          bg="white"
          borderRadius="md"
          shadow="md"
          p={4}
        >
          <PaymentsSummaryTable summary={summary} />
        </GridItem>
      </Grid>
      <Flex mt={4} justify="space-evenly">
        <Button onClick={goBack}>prev</Button>
        <Button colorScheme="cyan">save</Button>
      </Flex>
    </>
  );
}

export default UnpaidInvoices;
