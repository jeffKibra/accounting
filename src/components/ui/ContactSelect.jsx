import { Button } from '@chakra-ui/react';
import { useFormContext, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';

import ContactSelectModal from './ContactSelectModal';

//----------------------------------------------------------------------
ContactSelect.propTypes = {
  name: PropTypes.string.isRequired,
  controllerProps: PropTypes.object,
};

export default function ContactSelect({ name, controllerProps }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      shouldUnregister={true}
      render={({ field }) => {
        const { onBlur, onChange, value } = field;

        function onSelect(contact) {
          //   console.log({ contact });
          onChange(contact);
        }

        return (
          <ContactSelectModal onSelect={onSelect} selectedContact={value}>
            {(onOpen, ref) => {
              return (
                <Button
                  ref={ref}
                  onBlur={onBlur}
                  variant="outline"
                  size="sm"
                  width="100%"
                  textAlign="left"
                  justifyContent="flex-start"
                  fontWeight="normal"
                  onClick={onOpen}
                >
                  {value?.displayName ? value.displayName : 'select contact'}
                </Button>
              );
            }}
          </ContactSelectModal>
        );
      }}
      {...controllerProps}
    />
  );
}
