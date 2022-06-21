import { Heading } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { DASHBOARD } from "../../nav/routes";

function Title() {
  return (
    <Link to={DASHBOARD}>
      <Heading ml={4} fontWeight="semibold" fontSize="md">
        (ACCOUNTS)
      </Heading>
    </Link>
  );
}

export default Title;
