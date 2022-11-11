import PropTypes from 'prop-types';
import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertIcon,
} from '@chakra-ui/react';

// ----------------------------------------------------------------

AlertError.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

AlertError.defaultProps = {
  title: '',
  message: 'Unknown error',
};

export default function AlertError({ title, message }) {
  return (
    <Alert status="error">
      <AlertIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
