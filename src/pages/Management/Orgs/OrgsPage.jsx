import { Link, useLocation } from "react-router-dom";
import { Button } from "@chakra-ui/react";

import PageLayout from "../../../components/layout/PageLayout";

import Orgs from "../../../containers/Admin/Orgs/Orgs";

function OrgsPage() {
  const location = useLocation();

  return (
    <PageLayout
      pageTitle="Organizations"
      actions={
        <Link to={`${location.pathname}/new`}>
          <Button colorScheme="cyan">New Org</Button>
        </Link>
      }
    >
      <Orgs />
    </PageLayout>
  );
}

export default OrgsPage;
