import { Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { RiAddLine } from 'react-icons/ri';

import { NEW_INVOICE } from '../../../nav/routes';

import useSavedLocation from '../../../hooks/useSavedLocation';
import PageLayout from '../../../components/layout/PageLayout';

import Invoices from '../../../containers/Management/Invoices/Invoices';

function InvoicesPage() {
  useSavedLocation().setLocation();

  return (
    <PageLayout
      pageTitle="Invoices"
      actions={
        <Link to={NEW_INVOICE}>
          <Button leftIcon={<RiAddLine />} colorScheme="cyan" size="sm">
            New Invoice
          </Button>
        </Link>
      }
    >
      <Invoices />
    </PageLayout>
  );
}

export default InvoicesPage;
