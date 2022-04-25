import PageLayout from "../../../components/layout/PageLayout";
import NewOrg from "../../../containers/Admin/Orgs/NewOrg";

import useSavedLocation from "../../../hooks/useSavedLocation";

function NewOrgPage() {
  useSavedLocation().setLocation();

  return (
    <PageLayout pageTitle="Create Organization">
      <NewOrg />
    </PageLayout>
  );
}

export default NewOrgPage;
