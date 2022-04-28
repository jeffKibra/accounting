import PageLayout from "../../../components/layout/PageLayout";

import useSavedLocation from "../../../hooks/useSavedLocation";

import EditCustomer from "../../../containers/Management/Customers/EditCustomer";

function EditCustomerPage() {
  useSavedLocation().setLocation();

  return (
    <PageLayout pageTitle="Customers">
      <EditCustomer />
    </PageLayout>
  );
}

export default EditCustomerPage;
