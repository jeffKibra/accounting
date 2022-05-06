import useSavedLocation from "../../../hooks/useSavedLocation";

import PageLayout from "../../../components/layout/PageLayout";
import EditInvoice from "../../../containers/Management/Invoices/EditInvoice";

function NewInvoicePage() {
  useSavedLocation().setLocation();

  return (
    <PageLayout pageTitle="New Invoice">
      <EditInvoice />
    </PageLayout>
  );
}

export default NewInvoicePage;
