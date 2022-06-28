import { useEffect, useMemo, useCallback } from "react";
import { connect } from "react-redux";
import { Grid, GridItem } from "@chakra-ui/react";

import { GET_LATEST_SUMMARY } from "../../../store/actions/summariesActions";

import SquareCard from "../../../components/Custom/Dashboard/SquareCard";

function Dashboard(props) {
  const { getSummary, summary, accounts } = props;

  useEffect(() => {
    getSummary();
  }, [getSummary]);

  const getAccountsTotal = useCallback((accounts, summary) => {
    return summary.accounts
      ? accounts.reduce((sum, account) => {
          const { accountId } = account;
          const amount = summary.accounts[accountId];

          return sum + +amount;
        }, 0)
      : 0;
  }, []);

  const { incomeTotal, expenseTotal } = useMemo(() => {
    const incomeAccounts = accounts.filter(
      (account) => account.accountType.main === "income"
    );
    const expenseAccounts = accounts.filter(
      (account) => account.accountType.main === "expense"
    );

    const incomeTotal = getAccountsTotal(incomeAccounts, summary);
    const expenseTotal = getAccountsTotal(expenseAccounts, summary);

    return { incomeTotal, expenseTotal };
  }, [accounts, summary, getAccountsTotal]);

  return (
    <Grid columnGap={3} rowGap={2} w="full" templateColumns="repeat(12, 1fr)">
      <GridItem colSpan={[12, 6, 4]}>
        <SquareCard
          data1={{
            label: "Income",
            amount: incomeTotal || 0,
          }}
          data2={{
            label: "Expenses",
            amount: expenseTotal || 0,
          }}
          cardLabel="PROFIT AND LOSS"
          netValue={incomeTotal}
        />
      </GridItem>

      <GridItem colSpan={[12, 6, 4]}>
        <SquareCard
          data1={{
            label: "Incoming",
            amount: summary?.cashFlow?.incoming || 0,
          }}
          data2={{
            label: "Outgoing",
            amount: summary?.cashFlow?.outgoing || 0,
          }}
          cardLabel="CASH FLOW"
          netValue={incomeTotal}
        />
      </GridItem>

      <GridItem colSpan={[12, 6, 4]}>
        <SquareCard
          data1={{
            label: "UNPAID INVOICES",
            amount: summary?.accounts?.accounts_receivable || 0,
          }}
          data2={{
            label: "UNPAID BILLS",
            amount: summary?.accounts?.accounts_payable || 0,
          }}
          cardLabel="OUTSTANDINGS"
          netValue={incomeTotal}
        />
      </GridItem>
    </Grid>
  );
}

function mapStateToProps(state) {
  const { loading, summary } = state.summariesReducer;
  const { accounts } = state.accountsReducer;

  return { loading, summary: summary || {}, accounts: accounts || [] };
}

function mapDispatchToProps(dispatch) {
  return {
    getSummary: () => dispatch({ type: GET_LATEST_SUMMARY }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
