import useSavedLocation from "../../../hooks/useSavedLocation";
import PageLayout from "../../../components/layout/PageLayout";

import EditInvoice from "../../../containers/Management/Invoices/EditInvoice";

function EditInvoicePage() {
  useSavedLocation().setLocation();

  return (
    <PageLayout pageTitle="Edit Invoice">
      <EditInvoice />
    </PageLayout>
  );
}

export default EditInvoicePage;
