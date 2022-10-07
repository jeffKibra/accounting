import PropTypes from 'prop-types';
import { Tabs, Tab, TabList, TabPanels, TabPanel } from '@chakra-ui/react';

import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import Empty from '../../../components/ui/Empty';

import CustomerOverview from '../../../components/Custom/Customers/CustomerOverview';
import CustomerTransactions from '../../../components/Custom/Customers/CustomerTransactions';

function ViewCustomer(props) {
  const { customer, loading } = props;

  return loading ? (
    <SkeletonLoader />
  ) : customer?.displayName ? (
    <Tabs isLazy w="full" mt={-3} bg="white" borderRadius="md" shadow="md">
      <TabList>
        <Tab>Overview</Tab>
        <Tab>Transactions</Tab>
      </TabList>
      <TabPanels>
        <TabPanel w="full">
          <CustomerOverview customer={customer} />
        </TabPanel>
        {/* <TabPanel>plus</TabPanel> */}
        <TabPanel p={2} w="full">
          <CustomerTransactions customer={customer} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  ) : (
    <Empty message="Customer data not found! Try to reload the page!" />
  );
}

ViewCustomer.propTypes = {
  loading: PropTypes.bool.isRequired,
  customer: PropTypes.shape({
    status: PropTypes.number,
    type: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    companyName: PropTypes.string,
    displayName: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    mobile: PropTypes.string,
    openingBalance: PropTypes.number,
    website: PropTypes.string,
    remarks: PropTypes.string,
    billingStreet: PropTypes.string,
    billingCity: PropTypes.string,
    billingState: PropTypes.string,
    billingPostalCode: PropTypes.string,
    billingCountry: PropTypes.string,
    shippingStreet: PropTypes.string,
    shippingCity: PropTypes.string,
    shippingState: PropTypes.string,
    shippingPostalCode: PropTypes.string,
    shippingCountry: PropTypes.string,
  }),
};

export default ViewCustomer;
