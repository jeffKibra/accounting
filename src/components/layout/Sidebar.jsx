import { Accordion, Box, VStack, Divider } from "@chakra-ui/react";
import DrawerItem from "../ui/DrawerItem";
import {
  RiDashboardLine,
  RiShoppingBagLine,
  RiContactsLine,
  RiShoppingCartLine,
  RiCoinsLine,
  RiStore3Line,
} from "react-icons/ri";

import { isAdmin } from "../../utils/roles";
import useAuth from "../../hooks/useAuth";

import * as routes from "../../nav/routes";
import ExpandableDrawerItem from "../ui/ExpandableDrawerItem";

import { DRAWER_WIDTH } from "../../utils/constants";

export default function Sidebar() {
  const userProfile = useAuth();

  return userProfile ? (
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
          {isAdmin(userProfile.role) ? <AdminSidebar /> : <ManagementSidebar />}
        </VStack>
      </Accordion>
    </Box>
  ) : null;
}

function AdminSidebar(props) {
  return (
    <>
      <DrawerItem route={routes.DASHBOARD} icon={RiDashboardLine}>
        Dashboard
      </DrawerItem>
      <DrawerItem route={routes.ORGS} icon={RiStore3Line}>
        Organizations
      </DrawerItem>
    </>
  );
}

function ManagementSidebar(props) {
  return (
    <>
      <DrawerItem route={routes.DASHBOARD} icon={RiDashboardLine}>
        Dashboard
      </DrawerItem>
      <DrawerItem route={routes.ITEMS} icon={RiShoppingBagLine}>
        Items
      </DrawerItem>
      <DrawerItem route={routes.CUSTOMERS} icon={RiContactsLine}>
        Customers
      </DrawerItem>
      <DrawerItem route={routes.EXPENSES} icon={RiCoinsLine}>
        Expenses
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
    </>
  );
}
