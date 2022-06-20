import { Button } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { RiAddLine } from "react-icons/ri";

import useSavedLocation from "../../../hooks/useSavedLocation";

import PageLayout from "../../../components/layout/PageLayout";
import Items from "../../../containers/Management/Items/Items";

function ItemsPage() {
  const location = useLocation();
  useSavedLocation().setLocation();

  return (
    <PageLayout
      pageTitle="Items List"
      actions={
        <Link to={`${location.pathname}/new`}>
          <Button
            rightIcon={<RiAddLine />}
            variant="outline"
            colorScheme="cyan"
            size="sm"
          >
            new
          </Button>
        </Link>
      }
    >
      <Items />
    </PageLayout>
  );
}

export default ItemsPage;
