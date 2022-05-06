import {
  Stack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Box,
} from "@chakra-ui/react";
import {
  RiDeleteBin4Line,
  RiEdit2Line,
  RiEyeLine,
  RiMoreFill,
} from "react-icons/ri";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Dialog from "../ui/Dialog";

function TableActions(props) {
  const { viewRoute, editRoute, deleteDialog } = props;
  const { title, message, onConfirm, isDeleted, loading } = deleteDialog;

  function DeleteDialog(props) {
    const { renderTrigger } = props;

    return (
      <Dialog
        isDone={isDeleted}
        loading={loading}
        title={title}
        message={message}
        onConfirm={onConfirm}
        renderButton={renderTrigger}
      />
    );
  }

  return (
    <>
      <Box display={["block", null, "none"]}>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Table Options"
            icon={<RiMoreFill />}
            colorScheme="cyan"
            size="xs"
            variant="outline"
          />
          <MenuList>
            {viewRoute && (
              <MenuItem as={Link} to={viewRoute} icon={<RiEyeLine />}>
                View
              </MenuItem>
            )}
            {editRoute && (
              <MenuItem as={Link} to={editRoute} icon={<RiEdit2Line />}>
                Edit
              </MenuItem>
            )}
            {deleteDialog && (
              <DeleteDialog
                renderTrigger={(onOpen) => {
                  return (
                    <MenuItem
                      onClick={onOpen}
                      icon={<RiDeleteBin4Line color="red" />}
                    >
                      Delete
                    </MenuItem>
                  );
                }}
              />
            )}
          </MenuList>
        </Menu>
      </Box>

      <Stack display={["none", null, "flex"]} direction="row" spacing={1}>
        {viewRoute && (
          <IconButton
            size="xs"
            colorScheme="cyan"
            icon={<RiEyeLine />}
            title="View"
            as={Link}
            to={viewRoute}
          />
        )}

        {editRoute && (
          <IconButton
            size="xs"
            colorScheme="cyan"
            icon={<RiEdit2Line />}
            title="Edit"
            as={Link}
            to={editRoute}
          />
        )}

        {deleteDialog && (
          <DeleteDialog
            renderTrigger={(onOpen) => {
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
        )}
      </Stack>
    </>
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
  editRoute: PropTypes.string,
  viewRoute: PropTypes.string,
};

export default TableActions;
