import { useState } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@chakra-ui/react';

import ControlledSelect from '../../ui/ControlledSelect';

import CustomerBookings from '../../../containers/Management/Bookings/CustomerBookings';

const transactionTypes = [
  { name: 'Bookings', value: 'bookings' },
  { name: 'Payments', value: 'payments' },
];

function CustomerTransactions(props) {
  console.log({ props });
  const {
    customer: { id: customerId },
  } = props;
  const [transactionType, setTransactionType] = useState('bookings');

  return (
    <Box w="full">
      <Box w="140px">
        <ControlledSelect
          onChange={setTransactionType}
          value={transactionType}
          options={transactionTypes}
          allowClearSelection={false}
          colorScheme="cyan"
        />
      </Box>
      {/* <Divider  /> */}
      <Box py={2} w="full">
        <CustomerBookings customerId={customerId} />
      </Box>
    </Box>
  );
}

CustomerTransactions.propTypes = {
  customer: PropTypes.shape({ customerId: PropTypes.string.isRequired }),
};

export default CustomerTransactions;
