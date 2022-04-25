import PageLayout from "../../../components/layout/PageLayout";
import NewItem from "../../../containers/Management/Items/NewItem";

import useSavedLocation from "../../../hooks/useSavedLocation";

function NewItemPage() {
  useSavedLocation().setLocation();

  return (
    <PageLayout pageTitle="Add New Item">
      <NewItem />
    </PageLayout>
  );
}

export default NewItemPage;
