import { Button } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { RiAddLine } from 'react-icons/ri';

import { NEW_SALES_RECEIPT } from '../../../nav/routes';

import useSavedLocation from '../../../hooks/useSavedLocation';
import PageLayout from '../../../components/layout/PageLayout';

import SalesReceipts from '../../../containers/Management/SalesReceipts/SalesReceipts';

function SalesReceiptsPage() {
  const location = useLocation();
  useSavedLocation().setLocation();

  return (
    <PageLayout
      pageTitle="Sales Receipts"
      actions={
        <Link to={NEW_SALES_RECEIPT}>
          <Button colorScheme="cyan" size="sm" leftIcon={<RiAddLine />}>
            New Receipt
          </Button>
        </Link>
      }
      breadcrumbLinks={{
        Dashboard: '/',
        'Sales Receipts': location.pathname,
      }}
    >
      <SalesReceipts />
    </PageLayout>
  );
}

export default SalesReceiptsPage;
