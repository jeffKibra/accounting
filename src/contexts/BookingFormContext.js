import { createContext } from 'react';
import PropTypes from 'prop-types';

const defaultValues = {
  savedData: null,
};

const BookingFormContext = createContext(defaultValues);
export default BookingFormContext;

//----------------------------------------------------------------
BookingFormContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  savedData: PropTypes.object,
};

export function BookingFormContextProvider({ children, savedData }) {
  console.log({ savedData });

  return (
    <BookingFormContext.Provider
      value={{
        savedData,
      }}
    >
      {children}
    </BookingFormContext.Provider>
  );
}
