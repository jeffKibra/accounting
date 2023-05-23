import {
  TableContainer,
  Table,
  Tr,
  Tbody,
  Td,
  Box,
  Heading,
} from '@chakra-ui/react';
import {} from 'react-datepicker';
//
import ControlledDatePicker from 'components/ui/ControlledDatePicker';

import { isItemABooking } from 'utils/sales';

//
import './datePicker.css';

function FieldTitle({ children }) {
  return <Td color="#777777">{children}</Td>;
}

function FieldValue({ children }) {
  return <Td>{children}</Td>;
}

export default function ViewItem(props) {
  //   console.log({ props });
  const { item } = props;
  const {
    type,
    name,
    sku,
    salesAccount,
    salesTax,
    sellingPrice,
    buyingPrice,
    unit,
    bookings,
  } = item;

  const itemIsABooking = isItemABooking(type);

  //   let startDate = new Date();
  //   let endDate = new Date();
  //   if (Array.isArray(dateRange)) {
  //     const incomingStartDate = dateRange[0];
  //     const incomingEndDate = dateRange[1] || incomingStartDate;

  //     const startDateIsValid = checkIfDateIsValid(incomingStartDate);
  //     const endDateIsValid = checkIfDateIsValid(incomingEndDate);
  //     console.log({ startDateIsValid, endDateIsValid });

  //     if (startDateIsValid && endDateIsValid) {
  //       startDate = new Date(incomingStartDate);
  //       endDate = new Date(incomingEndDate);
  //     }
  //   }

  return (
    <Box w="100%">
      <Box>
        <TableContainer>
          <Table wordBreak="break-word">
            <Tbody>
              <Tr>
                <FieldTitle>Item Name</FieldTitle>
                <FieldValue>{name}</FieldValue>
              </Tr>
              <Tr>
                <FieldTitle>Item Type</FieldTitle>
                <FieldValue>{type}</FieldValue>
              </Tr>
              <Tr>
                <FieldTitle>SKU</FieldTitle>
                <FieldValue>{sku}</FieldValue>
              </Tr>
              <Tr>
                <FieldTitle>Sales Account</FieldTitle>
                <FieldValue>{salesAccount?.name || ''}</FieldValue>
              </Tr>
              <Tr>
                <FieldTitle>Selling Price</FieldTitle>
                <FieldValue>{sellingPrice}</FieldValue>
              </Tr>
              <Tr>
                <FieldTitle>Cost Price</FieldTitle>
                <FieldValue>{buyingPrice || 0}</FieldValue>
              </Tr>
              <Tr>
                <FieldTitle>Unit</FieldTitle>
                <FieldValue>{unit || ''}</FieldValue>
              </Tr>
              <Tr>
                <FieldTitle>Tax</FieldTitle>
                <FieldValue>
                  {salesTax
                    ? `${salesTax?.name} (${salesTax?.rate || ''}%)`
                    : ''}
                </FieldValue>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      {itemIsABooking && Object.keys(bookings).length > 0 ? (
        <ItemBookings bookings={bookings} />
      ) : null}
    </Box>
  );
}

function checkIfDateIsValid(date) {
  const dateString = new Date(date).toDateString();
  //   console.log({ dateString });

  return dateString !== 'Invalid Date';
}

function ItemBookings(props) {
  console.log({ props });
  const { bookings } = props;

  return (
    <Box w="100%" mt={6}>
      <Heading size="md" mb={4}>
        Bookings
      </Heading>

      <Box display="flex" justifyContent="center">
        <ControlledDatePicker
          name="viewBookings"
          inline
          excludeDateIntervals={Object.values(bookings).map(dateRange => {
            // console.log({ dateRange });
            let startDate = new Date();
            let endDate = new Date();

            if (Array.isArray(dateRange)) {
              const incomingStartDateString = dateRange[0];
              const incomingEndDateString =
                dateRange[1] || incomingStartDateString;

              const incomingStartDate = new Date(incomingStartDateString);
              const incomingEndDate = new Date(incomingEndDateString);

              const startDateIsValid = checkIfDateIsValid(incomingStartDate);
              const endDateIsValid = checkIfDateIsValid(incomingEndDate);

              const datesAreValid = startDateIsValid && endDateIsValid;
              if (datesAreValid) {
                startDate = incomingStartDate;
                endDate = incomingEndDate;
              }
            }

            return { start: startDate, end: endDate };
          })}
          //   dayClassName={(...params) => {
          //     console.log({ params });

          //     return '';
          //   }}
          //   renderDayContents={(day, date) => {
          //     console.log({ day, date });
          //     const tooltipText = `Tooltip for date: ${date}`;

          //     return <span className="highlight">{day}</span>;
          //   }}
        />
      </Box>
    </Box>
  );
}
