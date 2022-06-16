import { IconButton } from "@chakra-ui/react";
import { RiCloseLine } from "react-icons/ri";
import { Link } from "react-router-dom";

import { TAXES } from "../../../nav/routes";

import PageLayout from "../../../components/layout/PageLayout";
import EditTax from "../../../containers/Management/Taxes/EditTax";

import useSavedLocation from "../../../hooks/useSavedLocation";

function EditTaxPage() {
  useSavedLocation().setLocation();

  return (
    <PageLayout
      pageTitle="Edit Tax"
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
      <EditTax />
    </PageLayout>
  );
}

export default EditTaxPage;
