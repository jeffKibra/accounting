import { Flex, Button } from '@chakra-ui/react';
import PropTypes from 'prop-types';
//
import CustomModal from 'components/ui/CustomModal';
//
import ItemPricingFields from './ItemPricingFields';

EditBookingPricing.propTypes = {
  children: PropTypes.func.isRequired,
};

export default function EditBookingPricing({ children }) {
  return (
    <CustomModal
      title="Edit Car Pricing"
      closeOnOverlayClick
      renderTrigger={onOpen => {
        return children(onOpen);
      }}
      renderContent={() => {
        return <ItemPricingFields />;
      }}
      renderFooter={onClose => {
        return (
          <Flex>
            <Button onClick={onClose}>close</Button>
          </Flex>
        );
      }}
    />
  );
}
