import { Button } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";

import PageLayout from "../../../components/layout/PageLayout";
import Items from "../../../containers/Management/Items/Items";

function ItemsPage() {
  const location = useLocation();
  return (
    <PageLayout
      pageTitle="Items List"
      actions={
        <Link to={`${location.pathname}/new`}>
          <Button>new item</Button>
        </Link>
      }
    >
      <Items />
    </PageLayout>
  );
}

export default ItemsPage;
