import PageLayout from "../../../components/layout/PageLayout";
import NewTax from "../../../containers/Management/Taxes/NewTax";

import useSavedLocation from "../../../hooks/useSavedLocation";

function NewTaxPage() {
  useSavedLocation().setLocation();

  return (
    <PageLayout pageTitle="New Tax">
      <NewTax />
    </PageLayout>
  );
}

export default NewTaxPage;
