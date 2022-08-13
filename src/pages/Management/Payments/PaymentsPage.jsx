import { Button } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { RiAddLine } from 'react-icons/ri';

import { NEW_PAYMENT } from '../../../nav/routes';

import useSavedLocation from '../../../hooks/useSavedLocation';
import PageLayout from '../../../components/layout/PageLayout';

import Payments from '../../../containers/Management/Payments/Payments';

function PaymentsPage() {
  const location = useLocation();
  useSavedLocation().setLocation();

  return (
    <PageLayout
      pageTitle="Payments Received"
      actions={
        <Link to={NEW_PAYMENT}>
          <Button leftIcon={<RiAddLine />} colorScheme="cyan" size="sm">
            New Payment
          </Button>
        </Link>
      }
      breadcrumbLinks={{
        Dashboard: '/',
        Payments: location.pathname,
      }}
    >
      <Payments />
    </PageLayout>
  );
}

export default PaymentsPage;
