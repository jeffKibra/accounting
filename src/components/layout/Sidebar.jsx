import { Accordion, Box, VStack, Divider } from "@chakra-ui/react";
import DrawerItem from "../ui/DrawerItem";
import {
  RiDashboardLine,
  RiShoppingBagLine,
  RiContactsLine,
  RiShoppingCartLine,
} from "react-icons/ri";
import * as routes from "../../nav/routes";
import ExpandableDrawerItem from "../ui/ExpandableDrawerItem";

import { DRAWER_WIDTH } from "../../utils/constants";

export default function Sidebar() {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      zIndex="banner"
      bg="card"
      minH="100%"
      minW={`${DRAWER_WIDTH}px`}
      maxW={`${DRAWER_WIDTH}px`}
    >
      <Box minH="56px" />
      <Divider />
      <Accordion w="full" allowToggle>
        <VStack spacing="2px" mt={4} align="flex-start" w="full">
          <DrawerItem route={routes.DASHBOARD} icon={RiDashboardLine}>
            Dashboard
          </DrawerItem>
          <DrawerItem route={routes.ITEMS} icon={RiShoppingBagLine}>
            Items
          </DrawerItem>
          <DrawerItem route={routes.CUSTOMERS} icon={RiContactsLine}>
            Customers
          </DrawerItem>

          <ExpandableDrawerItem
            title="Sales"
            icon={RiShoppingCartLine}
            subRoutes={[
              { title: "Estimates", route: routes.ESTIMATES },
              { title: "Invoices", route: routes.INVOICES },
              { title: "Sales Receipts", route: routes.SALES_RECEIPTS },
            ]}
          />
        </VStack>
      </Accordion>
    </Box>
  );
}
