import { Button } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { RiAddLine } from 'react-icons/ri';

import { NEW_MANUAL_JOURNAL } from '../../../nav/routes';

import useSavedLocation from '../../../hooks/useSavedLocation';
import PageLayout from '../../../components/layout/PageLayout';

function JournalListPage() {
  useSavedLocation().setLocation();
  const location = useLocation();

  return (
    <PageLayout
      pageTitle="Journal List"
      actions={
        <Link to={NEW_MANUAL_JOURNAL}>
          <Button leftIcon={<RiAddLine />} colorScheme="cyan" size="sm">
            New Journal
          </Button>
        </Link>
      }
      breadcrumbLinks={{
        Dashboard: '/',
        'Journal List': location.pathname,
      }}
    >
      {/* <Invoices /> */}
    </PageLayout>
  );
}

export default JournalListPage;
