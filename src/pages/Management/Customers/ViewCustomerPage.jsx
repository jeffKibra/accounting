// import { useEffect } from 'react';
import {
  useParams,
  useLocation,
  //  useNavigate
} from 'react-router-dom';

// import useSavedLocation from '../../../hooks/useSavedLocation';
import { CUSTOMERS } from '../../../nav/routes';
//
import { useGetContact } from 'hooks';

import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import Empty from '../../../components/ui/Empty';
import PageLayout from '../../../components/layout/PageLayout';
import ViewCustomer from '../../../containers/Management/Customers/ViewCustomer';
import CustomerOptions from '../../../containers/Management/Customers/CustomerOptions';

function ViewCustomerPage(props) {
  const { updateCustomer } = props;
  // const navigate = useNavigate();

  const { customerId } = useParams();
  const location = useLocation();

  // useSavedLocation().setLocation();

  const { loading, contact } = useGetContact(customerId);

  function update(data) {
    updateCustomer({ ...data, customerId });
  }

  return (
    <PageLayout
      pageTitle={contact?.displayName || 'Customer Details'}
      actions={contact && <CustomerOptions edit customer={contact} deletion />}
      breadcrumbLinks={{
        Dashboard: '/',
        Customers: CUSTOMERS,
        [customerId]: location.pathname,
      }}
    >
      {loading ? (
        <SkeletonLoader />
      ) : contact ? (
        (() => {
          const { metaData, searchScore, ...rest } = contact;
          return (
            <ViewCustomer customer={rest} loading={loading} saveData={update} />
          );
        })()
      ) : (
        <Empty message="Customer not Found!" />
      )}
    </PageLayout>
  );
}

export default ViewCustomerPage;
