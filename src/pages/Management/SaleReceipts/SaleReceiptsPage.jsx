import { Button } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { RiAddLine } from 'react-icons/ri';

import { NEW_SALE_RECEIPT } from 'nav/routes';

import useSavedLocation from 'hooks/useSavedLocation';
import PageLayout from 'components/layout/PageLayout';

import SaleReceipts from 'containers/Management/SaleReceipts/SaleReceipts';

function SaleReceiptsPage() {
  const location = useLocation();
  useSavedLocation().setLocation();

  return (
    <PageLayout
      pageTitle="Sales Receipts"
      actions={
        <Link to={NEW_SALE_RECEIPT}>
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
      <SaleReceipts />
    </PageLayout>
  );
}

export default SaleReceiptsPage;
