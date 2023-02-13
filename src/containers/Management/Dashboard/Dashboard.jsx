import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Grid, GridItem, Spinner, Box } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';

import { GET_SUMMARY } from '../../../store/actions/summariesActions';

import SquareCard from '../../../components/Custom/Dashboard/SquareCard';

//------------------------------------------------------------------
function CustomSpinner() {
  return (
    <Box
      shadow="md"
      w="full"
      h="full"
      p={6}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Spinner />
    </Box>
  );
}

//----------------------------------------------------------------

function Dashboard(props) {
  const { getSummary, summary } = props;
  // console.log({ summary });

  useEffect(() => {
    getSummary();
  }, [getSummary]);

  const incomeTotal = summary?.totalIncome || 0;
  const expenseTotal = summary?.totalExpenses || 0;
  const profitAndLoss = new BigNumber(incomeTotal - expenseTotal)
    .dp(2)
    .toNumber();

  const totalReceivables = summary?.totalReceivables || 0;
  const overdueInvoices = summary?.overdueInvoicesTotal || 0;
  const openReceivables = new BigNumber(totalReceivables - overdueInvoices)
    .dp(2)
    .toNumber();
  // console.log({ totalReceivables, overdueInvoices, openReceivables });

  const totalPayables = summary?.totalPayables || 0;
  const overdueBills = summary?.overdueBillsTotal || 0;
  const openPayables = new BigNumber(totalPayables - overdueBills)
    .dp(2)
    .toNumber();

  const cashflowIncoming = summary?.cashflow?.incoming || 0;
  const cashflowOutgoing = summary?.cashflow?.outgoing || 0;

  const netCashflow = new BigNumber(cashflowIncoming - cashflowOutgoing)
    .dp(2)
    .toNumber();

  return (
    <Grid gap={4} w="full" templateColumns="repeat(12, 1fr)">
      <GridItem colSpan={[12, 6]}>
        {summary ? (
          <SquareCard
            data1={{
              label: 'Open Invoices',
              amount: openReceivables,
            }}
            data2={{
              label: 'Overdue',
              amount: overdueInvoices,
            }}
            mainValueLabel=""
            cardLabel="UNPAID INVOICES"
            mainValue={totalReceivables}
          />
        ) : (
          <CustomSpinner />
        )}
      </GridItem>

      <GridItem colSpan={[12, 6]}>
        {summary ? (
          <SquareCard
            data1={{
              label: 'Open Bills',
              amount: openPayables,
            }}
            data2={{
              label: 'Overdue',
              amount: overdueBills,
            }}
            mainValueLabel=""
            cardLabel="UNPAID BILLS"
            mainValue={totalPayables}
          />
        ) : (
          <CustomSpinner />
        )}
      </GridItem>

      <GridItem colSpan={[12, 6]}>
        {summary ? (
          <SquareCard
            data1={{
              label: 'Income',
              amount: incomeTotal,
            }}
            data2={{
              label: 'Expenses',
              amount: expenseTotal,
            }}
            cardLabel="PROFIT AND LOSS"
            mainValue={profitAndLoss}
          />
        ) : (
          <CustomSpinner />
        )}
      </GridItem>

      <GridItem colSpan={[12, 6]}>
        {summary ? (
          <SquareCard
            data1={{
              label: 'Incoming',
              amount: cashflowIncoming,
            }}
            data2={{
              label: 'Outgoing',
              amount: cashflowOutgoing,
            }}
            cardLabel="CASH FLOW"
            mainValue={netCashflow}
          />
        ) : (
          <CustomSpinner />
        )}
      </GridItem>
    </Grid>
  );
}

function mapStateToProps(state) {
  const { loading, summary } = state.summariesReducer;

  return { loading, summary: summary?.main };
}

function mapDispatchToProps(dispatch) {
  return {
    getSummary: () => dispatch({ type: GET_SUMMARY, payload: 'main' }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
