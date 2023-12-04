import { useContext } from 'react';
import PropTypes from 'prop-types';

import RHFAutoComplete from './hookForm/RHFAutoComplete';
//
import { useContactSuggestions } from '../../hooks';

function SearchContacts(props) {
  const { contactGroup } = props;

  const { suggestions, loading } = useContactSuggestions(contactGroup);

  return (
    <RHFAutoComplete {...props} loading={loading} suggestions={suggestions} />
  );
}

SearchContacts.propTypes = {
  contactGroup: PropTypes.oneOf(['customer', 'vendor']),
};

export default SearchContacts;
