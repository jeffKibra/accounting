import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

function CustomAlert({ status, title, description }) {
  return (
    <Alert status={status}>
      <AlertIcon />
      <Box>
        <AlertTitle lineHeight={4}>{title}</AlertTitle>
        <AlertDescription lineHeight={4}>{description}</AlertDescription>
      </Box>
    </Alert>
  );
}

CustomAlert.propTypes = {
  status: PropTypes.oneOf(['success', 'error', 'info', 'warning', 'loading'])
    .isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

CustomAlert.defaultProps = {
  status: 'info',
};

export default CustomAlert;
