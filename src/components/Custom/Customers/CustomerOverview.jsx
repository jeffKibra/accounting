import PropTypes from "prop-types";
import {
  VStack,
  Flex,
  Box,
  Heading,
  Text,
  Grid,
  GridItem,
  Avatar,
  Stat,
  StatLabel,
  StatNumber,
  List,
  ListItem,
  ListIcon,
  Divider,
  Accordion,
  AccordionPanel,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
} from "@chakra-ui/react";
import { RiPhoneLine, RiGlobalLine } from "react-icons/ri";

import formats from "../../../utils/formats";

import EditOpeningBalance from "./EditOpeningBalance";

function CustomerOverview(props) {
  const { customer } = props;

  const {
    firstName,
    lastName,
    email,
    phone,
    salutation,
    openingBalance,
    summary,
    companyName,
    website,
    type,
    paymentTerm,
    customerId,
  } = customer;
  const { unusedCredits, invoicedAmount, invoicePayments } = summary;
  const pending = invoicedAmount - invoicePayments;

  return (
    <Grid w="full" columnGap={3} rowGap={2} templateColumns="repeat(12, 1fr)">
      <GridItem colSpan={[12, 4]}>
        {companyName && (
          <Box>
            <Text>{companyName}</Text>
            <Divider borderColor="gray.400" my={4} />
          </Box>
        )}

        <Flex>
          <Avatar />
          <VStack align="flex-start" w="full" wordBreak="break-word" ml={3}>
            <Heading size="xs">{`${salutation} ${firstName} ${lastName}`}</Heading>
            <Text fontSize="sm">{email}</Text>

            <List>
              <ListItem fontSize="sm">
                <ListIcon as={RiPhoneLine} />
                {phone}
              </ListItem>
              {website && (
                <ListItem fontSize="sm">
                  <ListIcon as={RiGlobalLine} />
                  {website}
                </ListItem>
              )}
            </List>
          </VStack>
        </Flex>
      </GridItem>

      <GridItem colSpan={[12, 4]} whiteSpace="normal" wordBreak="break-word">
        <VStack align="flex-start">
          <Text fontSize="sm" color="gray.500">
            Customer Type:{" "}
            <Text color="black" as="span">
              {type}
            </Text>
          </Text>
          <Text fontSize="sm" color="gray.500">
            Payment Terms:{" "}
            <Text color="black" as="span">
              {paymentTerm?.name}
            </Text>
          </Text>
          <Address customer={customer} />
        </VStack>
      </GridItem>

      <GridItem colSpan={[12, 4]}>
        <Stat
          p={2}
          borderRadius="md"
          border="1px solid"
          borderColor="gray.300"
          mb={1}
        >
          <StatLabel fontWeight="normal">Unpaid Invoices</StatLabel>
          <StatNumber fontSize="xl">{formats.formatCash(pending)}</StatNumber>
        </Stat>
        <Stat
          p={2}
          borderRadius="md"
          border="1px solid"
          borderColor="gray.300"
          mb={1}
        >
          <StatLabel fontWeight="normal">Unused Credits</StatLabel>
          <StatNumber fontSize="xl">
            {formats.formatCash(unusedCredits)}
          </StatNumber>
        </Stat>
        <Flex p={2} borderRadius="md" border="1px solid" borderColor="gray.300">
          <Stat>
            <StatLabel fontWeight="normal">Opening Balance</StatLabel>
            <StatNumber fontSize="xl">
              {formats.formatCash(openingBalance)}
            </StatNumber>
          </Stat>
          <EditOpeningBalance
            customerId={customerId}
            openingBalance={openingBalance}
          />
        </Flex>
      </GridItem>
    </Grid>
  );
}

CustomerOverview.propTypes = {
  customer: PropTypes.shape({
    status: PropTypes.string,
    type: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    companyName: PropTypes.string,
    displayName: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    mobile: PropTypes.string,
    openingBalance: PropTypes.number,
    website: PropTypes.string,
    remarks: PropTypes.string,
    billingStreet: PropTypes.string,
    billingCity: PropTypes.string,
    billingState: PropTypes.string,
    billingPostalCode: PropTypes.string,
    billingCountry: PropTypes.string,
    shippingStreet: PropTypes.string,
    shippingCity: PropTypes.string,
    shippingState: PropTypes.string,
    shippingPostalCode: PropTypes.string,
    shippingCountry: PropTypes.string,
  }),
};

export default CustomerOverview;

function Address(props) {
  const { customer } = props;
  const {
    billingCity,
    billingCountry,
    billingPostalCode,
    billingState,
    billingStreet,
    shippingCity,
    shippingCountry,
    shippingPostalCode,
    shippingState,
    shippingStreet,
    remarks,
  } = customer;

  return (
    <Accordion w="full" allowToggle>
      <CollapseItem title="Billing Address">
        <AddressItem
          city={billingCity}
          country={billingCountry}
          postalCode={billingPostalCode}
          state={billingState}
          street={billingStreet}
        />
      </CollapseItem>
      <CollapseItem title="Shipping Address">
        <AddressItem
          city={shippingCity}
          country={shippingCountry}
          postalCode={shippingPostalCode}
          state={shippingState}
          street={shippingStreet}
        />
      </CollapseItem>

      {remarks && <CollapseItem title="Remarks">{remarks}</CollapseItem>}
    </Accordion>
  );
}

function CollapseItem(props) {
  const { title, children } = props;
  return (
    <AccordionItem>
      <AccordionButton fontSize="sm" pl={0}>
        <Box flex={1} textAlign="left">
          {title}
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel fontSize="sm">{children}</AccordionPanel>
    </AccordionItem>
  );
}

function AddressItem(props) {
  const { city, country, postalCode, state, street } = props;

  return (
    <List>
      <VStack spacing={1} w="full" align="flex-start">
        {country && <CustomListItem title="Country" value={country} />}
        {state && <CustomListItem title="State" value={state} />}
        {city && <CustomListItem title="City" value={city} />}
        {postalCode && (
          <CustomListItem title="Postal Code" value={postalCode} />
        )}
        {street && <CustomListItem title="Street" value={street} />}
      </VStack>
    </List>
  );
}

function CustomListItem(props) {
  const { title, value } = props;
  return (
    <ListItem color="gray.500">
      {title}:{" "}
      <Text color="black" as="span">
        {value}
      </Text>
    </ListItem>
  );
}

CustomListItem.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};
