// import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

//
import { useGetInvoice } from 'hooks';

import BookingOptions from '../../../containers/Management/Bookings/BookingOptions';

import { BOOKINGS } from '../../../nav/routes';
//
import { Bookings } from 'utils/bookings';

// import useSavedLocation from '../../../hooks/useSavedLocation';

import PageLayout from '../../../components/layout/PageLayout';
import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import Empty from '../../../components/ui/Empty';

import ViewInvoice from '../../../containers/Management/Invoices/ViewInvoice';

function ViewBookingInvoicePage(props) {
  const { bookingId } = useParams();
  const location = useLocation();
  // useSavedLocation().setLocation();

  const { invoice, loading } = useGetInvoice(bookingId);
  // console.log({ invoice, loading });

  return (
    <PageLayout
      pageTitle="Booking Invoice"
      actions={
        invoice && (
          <BookingOptions
            booking={Bookings.convertInvoiceToBooking(invoice)}
            edit
            deletion
            download
          />
        )
      }
      breadcrumbLinks={{
        Dashboard: '/',
        Bookings: BOOKINGS,
        [String(bookingId).padStart(6, '0')]: location.pathname,
      }}
    >
      {loading ? (
        <SkeletonLoader />
      ) : invoice ? (
        <ViewInvoice invoice={invoice} />
      ) : (
        <Empty message="Invoice not found!" />
      )}
    </PageLayout>
  );
}

export default ViewBookingInvoicePage;
