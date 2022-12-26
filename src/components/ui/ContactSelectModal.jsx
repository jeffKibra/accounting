import { useRef, useState } from 'react';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Box,
  CircularProgress,
  Alert,
  AlertIcon,
  Text,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

import { useSearchContacts } from 'hooks';

import SearchOnTypeInput from './SearchOnTypeInput';
import Pagination from './Pagination';

//----------------------------------------------------------------------

ContactSelectModal.propTypes = {
  children: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedContact: PropTypes.object,
};

export default function ContactSelectModal({
  children,
  onSelect,
  selectedContact,
}) {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [searchString, setSearchString] = useState('');

  const { isLoading, search, fullListLength, list, hitsPerPage, error } =
    useSearchContacts();

  const inputRef = useRef(null);
  const triggerRef = useRef(null);

  function handleContactSelection(contact) {
    onSelect(contact);
    //close modal
    onClose();
  }

  function searchAlgolia(value) {
    setSearchString(value);
    search(value);
  }

  function handleSearchPageChange(pageNumber) {
    search(searchString, pageNumber - 1);
  }

  return (
    <>
      {children(onOpen, triggerRef)}

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        initialFocusRef={inputRef}
        finalFocusRef={triggerRef}
        closeOnOverlayClick={false}
        scrollBehavior="inside"
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Search Contact</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SearchOnTypeInput
              ref={inputRef}
              onSearch={searchAlgolia}
              delay={1000}
            />
            {isLoading ? (
              <Box display="flex" justifyContent="center" py={2}>
                <CircularProgress isIndeterminate size="30px" />
              </Box>
            ) : null}
            {error ? (
              <Alert status="error" my={4}>
                <AlertIcon />
                {error?.message || 'Unknown Error!'}
              </Alert>
            ) : null}

            <Grid
              templateColumns="repeat(12, 1fr)"
              my={2}
              justifyContent="center"
              gap={2}
            >
              <SearchResultList
                list={list}
                onSelect={handleContactSelection}
                selectedContact={selectedContact}
              />
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Pagination
              onChange={handleSearchPageChange}
              itemsPerPage={hitsPerPage}
              listLength={fullListLength}
              subListLength={list?.length || 0}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function SearchResultList({ list, onSelect, selectedContact }) {
  function selectContact(item) {
    const { companyName, displayName, email, objectID, contactType, type } =
      item;

    onSelect({
      companyName,
      displayName,
      email,
      contactId: objectID,
      contactType,
      type: type || '',
    });
  }

  return list.map((item, i) => {
    return (
      <SearchResultItemCard
        selectedContact={selectedContact}
        onSelect={selectContact}
        key={i}
        item={item}
      />
    );
  });
}

function SearchResultItemCard({ item, onSelect, selectedContact }) {
  const {
    companyName,
    firstName,
    lastName,
    contactType,
    email,
    phone,
    objectID,
  } = item;
  const isSelected = selectedContact?.contactId === objectID;

  return (
    <GridItem
      colSpan={[12, 6]}
      border="1px solid #EDF2F7"
      borderRadius="8px"
      onClick={() => onSelect(item)}
      p={3}
      {...(isSelected
        ? { backgroundColor: theme => theme.colors.cyan[100] }
        : {})}
      _hover={{
        backgroundColor: theme => theme.colors.cyan[100],
        opacity: 0.8,
        cursor: 'pointer',
      }}
      _active={{
        backgroundColor: theme => theme.colors.cyan[200],
        opacity: 0.8,
      }}
    >
      <Text fontSize="14px">
        Name:{' '}
        <Text fontSize="16px" as="span">{`${firstName} ${lastName}`}</Text>
      </Text>
      {companyName ? (
        <Text fontSize="14px">
          Company:{' '}
          <Text fontSize="16px" as="span">
            {companyName}
          </Text>
        </Text>
      ) : null}
      <Text fontSize="14px">
        Contact Type:{' '}
        <Text fontSize="16px" as="span">
          {contactType}
        </Text>
      </Text>
      {email ? (
        <Text fontSize="14px">
          Email:{' '}
          <Text fontSize="16px" as="span">
            {email}
          </Text>
        </Text>
      ) : null}
      {email ? (
        <Text fontSize="14px">
          Phone:{' '}
          <Text fontSize="16px" as="span">
            {phone}
          </Text>
        </Text>
      ) : null}
    </GridItem>
  );
}
