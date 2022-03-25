import PageLayout from "../../../components/layout/PageLayout";
import NewExpense from "../../../containers/Management/Expenses/NewExpense";

function NewExpensePage() {
  return (
    <PageLayout pageTitle="New Expense">
      <NewExpense />
    </PageLayout>
  );
}

export default NewExpensePage;
