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

//
// import './datePicker.css';

function FieldTitle({ children }) {
  return <Td color="#777777">{children}</Td>;
}

function FieldValue({ children }) {
  return <Td>{children}</Td>;
}

export default function ViewItem(props) {
  // console.log({ props });
  const { item } = props;
  const {
    registration,
    model: modelData,
    year,
    rate,
    color,
    // sku,
    // salesAccount,
    // salesTax,
    // unit,
    description,
  } = item;
  const { model, make, type } = modelData;

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
                <FieldTitle>Registration</FieldTitle>
                <FieldValue>{registration}</FieldValue>
              </Tr>
              {/* <Tr>
                <FieldTitle>Vehicle Type</FieldTitle>
                <FieldValue>{type}</FieldValue>
              </Tr> */}

              <Tr>
                <FieldTitle>Make</FieldTitle>
                <FieldValue>{make}</FieldValue>
              </Tr>
              <Tr>
                <FieldTitle>Model</FieldTitle>
                <FieldValue>{`${model} (${year})`}</FieldValue>
              </Tr>
              <Tr>
                <FieldTitle>Color</FieldTitle>
                <FieldValue>{color}</FieldValue>
              </Tr>
              <Tr>
                <FieldTitle>Type</FieldTitle>
                <FieldValue>{type}</FieldValue>
              </Tr>

              {/* <Tr>
                <FieldTitle>Sales Account</FieldTitle>
                <FieldValue>{salesAccount?.name || ''}</FieldValue>
              </Tr> */}
              <Tr>
                <FieldTitle>Rate Per Day</FieldTitle>
                <FieldValue>{rate}</FieldValue>
              </Tr>

              {/* <Tr>
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
              </Tr> */}
              <Tr>
                <FieldTitle>Description</FieldTitle>
                <FieldValue>{description || ''}</FieldValue>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      {/* {Object.keys(bookings).length > 0 ? (
        <VehicleBookings bookings={bookings} />
      ) : null} */}
    </Box>
  );
}

function checkIfDateIsValid(date) {
  const dateString = new Date(date).toDateString();
  //   console.log({ dateString });

  return dateString !== 'Invalid Date';
}

function VehicleBookings(props) {
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
