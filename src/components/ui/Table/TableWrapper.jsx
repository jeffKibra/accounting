import PropTypes from 'prop-types';

//
import CustomAlert from 'components/ui/CustomAlert';
//
import SkeletonLoader from '../SkeletonLoader';
import Empty from '../Empty';
//

function TableWrapper(props) {
  const { loading, error, emptyMessage, data, children } = props;

  return loading ? (
    <SkeletonLoader />
  ) : data?.length > 0 ? (
    { children }
  ) : error ? (
    <CustomAlert
      status="error"
      title="Error loading data!"
      description={`${error?.code || ''} ${error?.message || 'Unknown Error!'}`}
    />
  ) : (
    <Empty {...(emptyMessage ? { message: emptyMessage } : {})} />
  );
}

export const TableWrapperPropTypes = {
  loading: PropTypes.bool,
  error: PropTypes.object,
  emptyMessage: PropTypes.string,
  data: PropTypes.array,
  children: PropTypes.node.isRequired,
};

TableWrapper.propTypes = {
  ...TableWrapperPropTypes,
};

export default TableWrapper;
