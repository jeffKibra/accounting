import { Grid, GridItem } from "@chakra-ui/react";

import PageLayout from "../../../components/layout/PageLayout";
import NewItem from "../../../containers/Management/Items/NewItem";

function NewItemPage() {
  return (
    <PageLayout pageTitle="Add New Item">
      <NewItem />
    </PageLayout>
  );
}

export default NewItemPage;
