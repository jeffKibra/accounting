// import { useEffect } from 'react';
import {
  useParams,
  useLocation,
  // useNavigate,
} from 'react-router-dom';

// import useSavedLocation from '../../../hooks/useSavedLocation';
import { CUSTOMERS } from '../../../nav/routes';

//
import { useUpdateContact } from 'hooks';

import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import Empty from '../../../components/ui/Empty';
import PageLayout from '../../../components/layout/PageLayout';
import EditCustomer from '../../../containers/Management/Customers/EditCustomer';

function EditCustomerPage(props) {
  // const navigate = useNavigate();
  const { customerId } = useParams();
  const location = useLocation();

  const { contact, loading, updating, updateContact } = useUpdateContact(
    customerId,
    'customer'
  );

  // useSavedLocation().setLocation();

  return (
    <PageLayout
      pageTitle="Edit Customer"
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
            <EditCustomer
              customer={rest}
              loading={updating}
              saveData={updateContact}
            />
          );
        })()
      ) : (
        <Empty message="Customer not Found!" />
      )}
    </PageLayout>
  );
}

export default EditCustomerPage;
