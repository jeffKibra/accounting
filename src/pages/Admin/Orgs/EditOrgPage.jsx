import PageLayout from "../../../components/layout/PageLayout";
import EditOrg from "../../../containers/Admin/Orgs/EditOrg";

import useSavedLocation from "../../../hooks/useSavedLocation";

function EditOrgPage() {
  useSavedLocation().setLocation();

  return (
    <PageLayout pageTitle="Edit Organization">
      <EditOrg />
    </PageLayout>
  );
}

export default EditOrgPage;
