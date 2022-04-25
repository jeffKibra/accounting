import useSavedLocation from "../../../hooks/useSavedLocation";

import PageLayout from "../../../components/layout/PageLayout";

import EditItem from "../../../containers/Management/Items/EditItem";

function EditItemPage() {
  useSavedLocation().setLocation();

  return (
    <PageLayout pageTitle="Edit Item">
      <EditItem />
    </PageLayout>
  );
}

export default EditItemPage;
