import { Button, Box } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { RiAddLine } from 'react-icons/ri';

import { NEW_PAYMENT_RECEIVED } from 'nav/routes';
//
import { ListPaymentsReceivedContextProvider } from 'contexts/ListPaymentsReceivedContext';

// import useSavedLocation from 'hooks/useSavedLocation';
import PageLayout from 'components/layout/PageLayout';

import PaymentsReceivedTable from '../../../components/tables/PaymentsReceived/PaymentsReceivedTable';

// import PaymentsReceivedList from 'containers/Management/PaymentsReceived/PaymentsReceivedList';

function PaymentsReceivedListPage() {
  const location = useLocation();
  // useSavedLocation().setLocation();

  return (
    <PageLayout
      pageTitle="Payments Received"
      actions={
        <Link to={NEW_PAYMENT_RECEIVED}>
          <Button leftIcon={<RiAddLine />} colorScheme="cyan" size="sm">
            New
          </Button>
        </Link>
      }
      breadcrumbLinks={{
        Dashboard: '/',
        'Payments Received': location.pathname,
      }}
    >
      <ListPaymentsReceivedContextProvider>
        <Box w="full" bg="white" borderRadius="lg" shadow="lg">
          <PaymentsReceivedTable showCustomer />
        </Box>

        {/* <PaymentsReceivedList /> */}
      </ListPaymentsReceivedContextProvider>
    </PageLayout>
  );
}

export default PaymentsReceivedListPage;
