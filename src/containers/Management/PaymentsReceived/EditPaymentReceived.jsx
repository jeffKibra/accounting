// import { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

// import { useAccounts } from 'hooks';
import { usePaymentModes } from 'hooks';

import Empty from '../../../components/ui/Empty';
// import SkeletonLoader from '../../../components/ui/SkeletonLoader';

import PaymentReceivedForm from 'components/forms/PaymentReceived';

function EditPaymentReceived(props) {
  const { updating, saveData, payment, paymentId } = props;

  const { paymentModes } = usePaymentModes();

  // const paymentAccounts = useMemo(() => {
  //   if (!Array.isArray(accounts)) {
  //     return [];
  //   }

  //   return accounts
  //     .filter(account => {
  //       const {
  //         accountType: { id },
  //         tags,
  //       } = account;
  //       const index = tags.findIndex(tag => tag === 'receivable');

  //       return (
  //         id === 'cash' || (id === 'other_current_liability' && index > -1)
  //       );
  //     })
  //     .map(account => {
  //       const { name, accountId, accountType } = account;
  //       return { name, accountId, accountType };
  //     });
  // }, [accounts]);

  return paymentModes && Object.keys(paymentModes).length > 0 ? (
    <PaymentReceivedForm
      updating={updating}
      paymentModes={paymentModes}
      onSubmit={saveData}
      payment={payment}
      paymentId={paymentId}
    />
  ) : (
    <Empty
      message={
        'Failed to load Payment Modes. This could be because of a network issue. Try reloading the page!'
      }
    />
  );
}

EditPaymentReceived.propTypes = {
  saveData: PropTypes.func.isRequired,
  updating: PropTypes.bool.isRequired,
  paymentId: PropTypes.string,
  payment: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    customer: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
    }),
    amount: PropTypes.number.isRequired,
    paymentMode: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
    reference: PropTypes.string,
    excess: PropTypes.number,
    // accountId: PropTypes.string,
    bankCharges: PropTypes.number,
    paymentDate: PropTypes.oneOfType([
      PropTypes.instanceOf(Date),
      PropTypes.string,
    ]),
    // taxDeducted: PropTypes.string,
    // tdsTaxAccount: PropTypes.string,
    notes: PropTypes.string,
  }),
};

export default EditPaymentReceived;
