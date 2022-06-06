import React from "react";
import { IconButton, MenuItem, useBreakpointValue } from "@chakra-ui/react";
import PropTypes from "prop-types";

function Option(props) {
  const {
    responsive,
    breakpoint,
    icon: Icon,
    name,
    colorScheme,
    ...extras
  } = props;
  const point = breakpoint || "lg";
  const useMenu = useBreakpointValue({ base: !!responsive, [point]: false });

  return useMenu ? (
    <MenuItem {...extras}>{name}</MenuItem>
  ) : (
    <IconButton
      title={name}
      colorScheme={colorScheme || "cyan"}
      icon={<Icon />}
    />
  );
}

Option.propTypes = {
  responsive: PropTypes.bool,
  breakpoint: PropTypes.string,
  icon: PropTypes.any,
  name: PropTypes.string.isRequired,
  colorScheme: PropTypes.string,
};

export default Option;
