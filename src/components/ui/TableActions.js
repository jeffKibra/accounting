import React from "react";
import { MenuItem } from "@chakra-ui/react";
import { RiDeleteBinLine, RiEdit2Line } from "react-icons/ri";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import Dialog from "./Dialog";
import IconsMenu from "./IconsMenu";

function TableActions(props) {
  const { loading, title, message, onConfirm, editRoute, isDeleted } = props;
  const navigate = useNavigate();

  return (
    <IconsMenu>
      <MenuItem icon={<RiEdit2Line />} onClick={() => navigate(editRoute)}>
        Edit
      </MenuItem>
      <Dialog
        isDone={isDeleted}
        loading={loading}
        title={title}
        message={message}
        onConfirm={(onClose) => onConfirm(onClose)}
        renderButton={(onOpen) => {
          return (
            <MenuItem icon={<RiDeleteBinLine />} onClick={onOpen}>
              Delete
            </MenuItem>
          );
        }}
      />
    </IconsMenu>
  );
}

TableActions.propTypes = {
  loading: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  editRoute: PropTypes.string.isRequired,
  isDeleted: PropTypes.bool.isRequired,
};

export default TableActions;
