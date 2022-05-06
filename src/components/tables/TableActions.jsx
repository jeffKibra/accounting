import { Stack, IconButton } from "@chakra-ui/react";
import { RiDeleteBin4Line, RiEdit2Line } from "react-icons/ri";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Dialog from "../ui/Dialog";

function TableActions(props) {
  const {
    editRoute,
    deleteDialog: { title, message, onConfirm, isDeleted, loading },
  } = props;

  return (
    <Stack direction="row" spacing={1}>
      <Link to={editRoute}>
        {" "}
        <IconButton
          size="xs"
          colorScheme="cyan"
          icon={<RiEdit2Line />}
          title="Edit"
        />
      </Link>

      <Dialog
        isDone={isDeleted}
        loading={loading}
        title={title}
        message={message}
        onConfirm={onConfirm}
        renderButton={(onOpen) => {
          return (
            <IconButton
              size="xs"
              onClick={onOpen}
              colorScheme="red"
              icon={<RiDeleteBin4Line />}
              title="Delete"
            />
          );
        }}
      />
    </Stack>
  );
}

TableActions.propTypes = {
  deleteDialog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    message: PropTypes.node.isRequired,
    onConfirm: PropTypes.func.isRequired,
    isDeleted: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
  }),
  editRoute: PropTypes.string.isRequired,
};

export default TableActions;
