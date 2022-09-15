/**
 *
 * @typedef {Object} customer
 * @property {string} customerId
 * @property {string} displayName
 * @property {{name:"", value:""}} paymentTerm
 * @property {number} openingBalance
 * @property {string} type
 */

export { default as getCustomerData } from './getCustomerData';
export { default as getCustomerEntry } from './getCustomerEntry';
export { default as createCustomer } from './createCustomer';
export { default as CustomerOpeningBalance } from './openingBalance';
