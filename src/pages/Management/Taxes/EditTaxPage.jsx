import PageLayout from "../../../components/layout/PageLayout";
import EditTax from "../../../containers/Management/Taxes/EditTax";

import useSavedLocation from "../../../hooks/useSavedLocation";

function EditTaxPage() {
  useSavedLocation().setLocation();

  return (
    <PageLayout pageTitle="Edit Tax">
      <EditTax />
    </PageLayout>
  );
}

export default EditTaxPage;
