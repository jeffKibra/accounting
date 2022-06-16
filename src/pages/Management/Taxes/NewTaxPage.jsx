import { IconButton } from "@chakra-ui/react";
import { RiCloseLine } from "react-icons/ri";
import { Link } from "react-router-dom";

import { TAXES } from "../../../nav/routes";

import PageLayout from "../../../components/layout/PageLayout";
import NewTax from "../../../containers/Management/Taxes/NewTax";

import useSavedLocation from "../../../hooks/useSavedLocation";

function NewTaxPage() {
  useSavedLocation().setLocation();

  return (
    <PageLayout
      pageTitle="New Tax"
      actions={
        <Link to={TAXES}>
          <IconButton
            colorScheme="red"
            variant="outline"
            size="sm"
            title="cancel"
            icon={<RiCloseLine />}
          />
        </Link>
      }
    >
      <NewTax />
    </PageLayout>
  );
}

export default NewTaxPage;
