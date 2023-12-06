import PropTypes from 'prop-types';

import RHFAutoComplete from './hookForm/RHFAutoComplete';
//
import { useContactSuggestions } from '../../hooks';

function SearchContacts(props) {
  const { name, contactGroup, isDisabled, ...moreProps } = props;

  const { suggestions, loading, fetchSuggestions } =
    useContactSuggestions(contactGroup);

  return (
    <RHFAutoComplete
      {...moreProps}
      loading={loading}
      optionsConfig={{ nameField: 'displayName', valueField: '_id' }}
      options={suggestions}
      name={name}
      isDisabled={isDisabled}
      onSearch={fetchSuggestions}
    />
  );
}

SearchContacts.propTypes = {
  name: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  contactGroup: PropTypes.oneOf(['customer', 'vendor']),
  placeholder: PropTypes.string,
  controllerProps: PropTypes.object,
};

export default SearchContacts;
