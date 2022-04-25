import { Text, Link } from "@chakra-ui/react";

function SidebarFooter() {
  return (
    <Text>
      &copy; {new Date().getFullYear()}{" "}
      <Link href="https://finitecreations.co.ke" target="_blank">
        finite creations
      </Link>
    </Text>
  );
}

export default SidebarFooter;
