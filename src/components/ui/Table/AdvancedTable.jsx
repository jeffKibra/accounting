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
import Table, { TableProps } from './Table';

function AdvancedTable(props) {
  const { loading, error, emptyMessage, ...tableProps } = props;
  const { data } = tableProps;
  // console.log({ bodyRowProps });

  return loading ? (
    <SkeletonLoader />
  ) : data?.length > 0 ? (
    <Table {...tableProps} />
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
  ...TableProps,
  loading: PropTypes.bool,
  error: PropTypes.object,
  emptyMessage: PropTypes.string,
};

AdvancedTable.propTypes = {
  ...AdvancedTableProps,
};

export default AdvancedTable;
