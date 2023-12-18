import {
  Alert,
  AlertTitle,
  AlertDescription,
  Heading,
  Text,
  CloseButton,
  Box,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

//

function SelectedVehiclePreview(props) {
  const { selectedVehicle, onClearSelection } = props;

  function clearSelection() {
    onClearSelection();
  }

  if (!selectedVehicle) {
    return null;
  }

  const {
    registration,
    model: { model, make },
    year,
  } = selectedVehicle;

  return (
    <Box w="full">
      <Alert status="info" variant="subtle">
        <Box w="full">
          <AlertTitle>Selected Vehicle</AlertTitle>
          <AlertDescription>
            <Heading>{registration}</Heading>
            <Text>{`${make} ${model} (${year})`}</Text>
          </AlertDescription>
        </Box>

        <CloseButton
          alignSelf="flex-start"
          position="relative"
          right={-1}
          top={-1}
          onClick={clearSelection}
        />
      </Alert>
    </Box>
  );
}

SelectedVehiclePreview.propTypes = {
  selectedVehicle: PropTypes.object,
  onClearSelection: PropTypes.func,
};

export default SelectedVehiclePreview;
