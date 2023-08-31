import {
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

//
import SkeletonLoader from '../SkeletonLoader';
import Empty from '../Empty';
//
import RTTable, { RTTablePropTypes } from './RTTable';

function AdvancedTable(props) {
  const { loading, error, emptyMessage, ...tableProps } = props;
  const { data } = tableProps;
  // console.log({ tableProps });

  return loading ? (
    <SkeletonLoader />
  ) : data?.length > 0 ? (
    <RTTable {...tableProps} />
  ) : error ? (
    <Alert>
      <AlertIcon />
      <AlertTitle>Error loading data!</AlertTitle>
      <AlertDescription>{`${error?.code || ''} ${
        error?.message || 'Unknown Error!'
      }`}</AlertDescription>
    </Alert>
  ) : (
    <Empty {...(emptyMessage ? { message: emptyMessage } : {})} />
  );
}

export const AdvancedTableProps = {
  ...RTTablePropTypes,
  loading: PropTypes.bool,
  error: PropTypes.object,
  emptyMessage: PropTypes.string,
};

AdvancedTable.propTypes = {
  ...AdvancedTableProps,
};

export default AdvancedTable;
