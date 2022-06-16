import { useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { RiDeleteBin4Line, RiEdit2Line, RiEyeLine } from "react-icons/ri";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import useDeleteTax from "../../../hooks/useDeleteTax";

import MenuOptions from "../../../components/ui/MenuOptions";

function TaxOptions(props) {
  const { tax, edit, view, deletion } = props;
  console.log({ tax });
  const { taxId } = tax;
  const { details, isDeleted, resetTax } = useDeleteTax(tax);
  useEffect(() => {
    if (isDeleted) {
      resetTax();
    }
  }, [isDeleted, resetTax]);

  const options = [
    ...(view
      ? [
          {
            name: "View",
            icon: RiEyeLine,
            as: Link,
            to: `/settings/taxes/${taxId}/view`,
          },
        ]
      : []),
    ...(edit
      ? [
          {
            name: "Edit",
            icon: RiEdit2Line,
            as: Link,
            to: `/settings/taxes/${taxId}/edit`,
          },
        ]
      : []),
    ...(deletion
      ? [
          {
            name: "Delete",
            icon: RiDeleteBin4Line,
            dialogDetails: {
              ...details,
            },
          },
        ]
      : []),
  ];

  return (
    <>
      <Box>
        <MenuOptions options={options} />
      </Box>
    </>
  );
}

TaxOptions.propTypes = {
  tax: PropTypes.object.isRequired,
  edit: PropTypes.bool,
  view: PropTypes.bool,
  deletion: PropTypes.bool,
};

export default TaxOptions;
