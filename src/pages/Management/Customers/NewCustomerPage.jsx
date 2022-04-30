import PageLayout from "../../../components/layout/PageLayout";

import useSavedLocation from "../../../hooks/useSavedLocation";

import NewCustomer from "../../../containers/Management/Customers/NewCustomer";

function NewCustomerPage() {
  useSavedLocation().setLocation();

  return (
    <PageLayout pageTitle="New Customer">
      <NewCustomer />
    </PageLayout>
  );
}

export default NewCustomerPage;
