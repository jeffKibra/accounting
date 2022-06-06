import React from "react";
import { Stack, IconButton } from "@chakra-ui/react";

import Dialog from "./Dialog";

function Options(props) {
  const { options } = props;

  return (
    <Stack display={["none", null, "flex"]} direction="row" spacing={1}>
      {options.map((option, i) => {
        const {
          name,
          icon: Icon,
          dialogDetails,
          colorScheme,
          ...extraProps
        } = option;

        return dialogDetails ? (
          <Dialog
            {...dialogDetails}
            renderButton={(onOpen) => {
              return (
                <IconButton
                  size="xs"
                  onClick={onOpen}
                  colorScheme={colorScheme}
                  icon={<Icon />}
                  title={name}
                />
              );
            }}
          />
        ) : (
          <IconButton
            size="xs"
            colorScheme={colorScheme}
            icon={<Icon />}
            title="View"
            {...extraProps}
          />
        );
      })}
    </Stack>
  );
}

export default Options;
