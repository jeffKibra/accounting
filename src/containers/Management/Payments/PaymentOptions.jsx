import { useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { RiDeleteBin4Line, RiEdit2Line, RiEyeLine } from "react-icons/ri";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import useDeletePayment from "../../../hooks/useDeletePayment";

import MenuOptions from "../../../components/ui/MenuOptions";

function PaymentOptions(props) {
  const { payment, edit, view, deletion } = props;
  const { paymentId } = payment;
  const { details, isDeleted, resetPayment } = useDeletePayment(payment);

  useEffect(() => {
    if (isDeleted) {
      resetPayment();
    }
  }, [isDeleted, resetPayment]);

  const options = [
    ...(view
      ? [
          {
            name: "View",
            icon: RiEyeLine,
            as: Link,
            to: `/payments/${paymentId}/view`,
          },
        ]
      : []),
    ...(edit
      ? [
          {
            name: "Edit",
            icon: RiEdit2Line,
            as: Link,
            to: `/payments/${paymentId}/edit`,
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

PaymentOptions.propTypes = {
  payment: PropTypes.object.isRequired,
  edit: PropTypes.bool,
  view: PropTypes.bool,
  deletion: PropTypes.bool,
};

export default PaymentOptions;
