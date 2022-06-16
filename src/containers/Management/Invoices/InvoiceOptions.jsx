import { useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { RiDeleteBin4Line, RiEdit2Line, RiEyeLine } from "react-icons/ri";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import useDeleteInvoice from "../../../hooks/useDeleteInvoice";

import MenuOptions from "../../../components/ui/MenuOptions";

function InvoiceOptions(props) {
  const { invoice, edit, view, deletion } = props;
  const { invoiceId } = invoice;
  const { details, isDeleted, resetInvoice } = useDeleteInvoice(invoice);

  useEffect(() => {
    if (isDeleted) {
      resetInvoice();
    }
  }, [isDeleted, resetInvoice]);

  const options = [
    ...(view
      ? [
          {
            name: "View",
            icon: RiEyeLine,
            as: Link,
            to: `/invoices/${invoiceId}/view`,
          },
        ]
      : []),
    ...(edit
      ? [
          {
            name: "Edit",
            icon: RiEdit2Line,
            as: Link,
            to: `/invoices/${invoiceId}/edit`,
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

export default InvoiceOptions;
