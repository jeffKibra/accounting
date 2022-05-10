import { useEffect, useMemo, useState, useContext } from "react";
import { connect } from "react-redux";
import { Flex, Grid, GridItem, Button } from "@chakra-ui/react";

import { FormContext } from "../../../contexts/stepperFormContext";

import { GET_CUSTOMER_INVOICES } from "../../../store/actions/invoicesActions";

import SkeletonLoader from "../../ui/SkeletonLoader";
import Empty from "../../ui/Empty";

import UnpaidInvoicesTable from "../../tables/Invoices/UnpaidInvoicesTable";
import PaymentsSummaryTable from "../../tables/PaymentsReceived/PaymentsSummaryTable";

function UnpaidInvoices(props) {
  console.log({ props });
  const { loading, action, invoices, getInvoices } = props;
  const { state, finish, prev } = useContext(FormContext);
  console.log({ state });
  const { customerId, amount, taxDeducted } = state;
  const [selectedInvoices, setSelectedInvoices] = useState([...invoices]);

  const summary = useMemo(() => {
    const paidAmount = selectedInvoices.reduce((prev, current) => {
      return prev + current.latestPayment;
    }, 0);

    const balance = amount - paidAmount;

    const excess = balance > 0 ? balance : 0;

    return {
      paidAmount,
      excess,
      amount,
    };
  }, [selectedInvoices, amount]);

  function addInvoicePayment(data) {
    console.log({ data });
  }

  function autoPay() {
    let balance = summary.amount;

    const updated = invoices.map((invoice) => {
      let invoiceBalance = invoice.summary.balance;
      let latestPayment = 0;

      if (balance > 0) {
        if (balance >= invoiceBalance) {
          latestPayment = invoiceBalance;
          balance = balance - invoiceBalance;
          invoiceBalance = 0;
        } else {
          latestPayment = balance;
          invoiceBalance = invoiceBalance - balance;
          balance = 0;
        }
      }

      return {
        ...invoice,
        latestPayment,
        summary: {
          ...invoice.summary,
          balance: invoiceBalance,
        },
      };
    });

    console.log({ updated });

    setSelectedInvoices(updated);
  }

  useEffect(() => {
    console.log("fetching");
    getInvoices(customerId, ["sent"]);
  }, [getInvoices, customerId]);

  function goBack() {
    prev();
  }

  return loading && action === GET_CUSTOMER_INVOICES ? (
    <SkeletonLoader />
  ) : (
    <>
      <Grid mt={2} w="full" gap={2} templateColumns="repeat(12, 1fr)">
        <GridItem colSpan={12}>
          <UnpaidInvoicesTable
            autoPay={autoPay}
            addInvoicePayment={addInvoicePayment}
            taxDeducted={taxDeducted}
            invoices={selectedInvoices}
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

function mapStateToProps(state) {
  const { loading, action, invoices } = state.invoicesReducer;

  return { loading, action, invoices };
}

function mapDispatchToProps(dispatch) {
  return {
    getInvoices: (customerId, statuses) =>
      dispatch({ type: GET_CUSTOMER_INVOICES, customerId, statuses }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UnpaidInvoices);
