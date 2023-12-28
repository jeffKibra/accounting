import PropTypes from 'prop-types';
//

export const datePropType = PropTypes.oneOfType([
  PropTypes.instanceOf(Date),
  PropTypes.string,
]);
