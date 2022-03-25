import React from "react";
import { IconButton } from "@chakra-ui/react";
import { RiDeleteBinLine } from "react-icons/ri";

import Dialog from "./Dialog";

function TableDeleteDialog(props) {
  const { title, message, onDelete } = props;
  return (
    <Dialog
      renderButton={(onOpen) => (
        <IconButton colorScheme="red" icon={<RiDeleteBinLine />} />
      )}
    />
  );
}

export default TableDeleteDialog;
