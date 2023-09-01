import PropTypes from 'prop-types';

const tableProps = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      unit: PropTypes.string,
      description: PropTypes.string,
      sku: PropTypes.string,
      itemId: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['goods', 'services', 'vehicle']).isRequired,
      // costPrice: PropTypes.number.isRequired,
      rate: PropTypes.number.isRequired,
      salesTax: PropTypes.object,
    })
  ),
  loading: PropTypes.bool,
  error: PropTypes.object,
  emptyMessage: PropTypes.string,
  onRowClick: PropTypes.func,
  enableOptions: PropTypes.bool,
};

export default tableProps;
