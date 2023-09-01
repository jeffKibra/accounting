import PropTypes from 'prop-types';
//
import { datePropType } from './date';

const formProps = {
  startDate: datePropType,
  endDate: datePropType,
  quantity: PropTypes.number.isRequired,
  customer: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    companyName: PropTypes.string,
  }),
  item: PropTypes.object.isRequired,
  bookingRate: PropTypes.number,
  bookingTotal: PropTypes.number,
  transferAmount: PropTypes.number,
  subTotal: PropTypes.number,
  total: PropTypes.number,
  saleDate: datePropType,
  dueDate: datePropType,
  //   customerNotes: PropTypes.string,
  // salesTax: PropTypes.oneOfType([
  //   PropTypes.shape({
  //     name: PropTypes.string,
  //     rate: PropTypes.number,
  //     taxId: PropTypes.string,
  //   }),
  //   PropTypes.string,
  // ]),
  // itemTax: PropTypes.number.isRequired,
  // taxType: PropTypes.string,
};

export const bookingFormProps = PropTypes.shape(formProps);

export const bookingProps = PropTypes.shape({
  ...formProps,
  balance: PropTypes.number,
  status: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  orgId: PropTypes.string,
  // org: PropTypes.object.isRequired,
});
