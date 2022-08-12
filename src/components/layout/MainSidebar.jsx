import { Divider, Accordion, VStack, Flex } from '@chakra-ui/react';
import {
  RiDashboardLine,
  RiSettings6Line,
  RiShoppingBagLine,
  RiContactsLine,
  RiShoppingCartLine,
  RiCoinsLine,
  RiStore3Line,
} from 'react-icons/ri';

import { isAdmin } from '../../utils/roles';
import useAuth from '../../hooks/useAuth';

import { BAR_HEIGHT } from '../../constants';

import * as routes from '../../nav/routes';
import ExpandableDrawerItem from '../ui/ExpandableDrawerItem';
import DrawerItem from '../ui/DrawerItem';

import Title from './Title';

function MainSidebar(props) {
  const userProfile = useAuth();

  return userProfile ? (
    <Accordion w="full" allowToggle>
      <VStack spacing="2px" align="flex-start" w="full">
        <Flex alignItems="center" px={5} mb={5} w="full" h={`${BAR_HEIGHT}px`}>
          <Title />
        </Flex>

        {isAdmin(userProfile.role) ? <AdminSidebar /> : <ManagementSidebar />}
      </VStack>
    </Accordion>
  ) : null;
}

export default MainSidebar;

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
      {/* <DrawerItem route={routes.EXPENSES} icon={RiCoinsLine}>
        Expenses
      </DrawerItem> */}

      <ExpandableDrawerItem
        title="Sales"
        icon={RiShoppingCartLine}
        subRoutes={[
          // { title: "Estimates", route: routes.ESTIMATES },
          { title: 'Invoices', route: routes.INVOICES },
          { title: 'Payments Received', route: routes.PAYMENTS },
          { title: 'Sales Receipts', route: routes.SALES_RECEIPTS },
        ]}
      />
      <Divider />
      <ExpandableDrawerItem
        title="Purchases"
        icon={RiCoinsLine}
        subRoutes={[
          { title: 'Vendors', route: routes.VENDORS },
          { title: 'Expenses', route: routes.EXPENSES },
        ]}
      />
      <Divider />

      <ExpandableDrawerItem
        title="Settings"
        icon={RiSettings6Line}
        subRoutes={[{ title: 'Taxes', route: routes.TAXES }]}
      />
    </>
  );
}
