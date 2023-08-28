import { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import {
  RiCalendarEventLine,
  RiDeleteBin4Line,
  RiEdit2Line,
  RiEyeLine,
} from 'react-icons/ri';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import useDeleteItem from '../../../hooks/useDeleteItem';

import MenuOptions from '../../../components/ui/MenuOptions';

function ItemOptions(props) {
  const { item, edit, view, deletion, schedule } = props;
  const { itemId } = item;
  const { details, isDeleted, resetItem } = useDeleteItem(item);

  useEffect(() => {
    if (isDeleted) {
      resetItem();
    }
  }, [isDeleted, resetItem]);

  const options = [
    ...(view
      ? [
          {
            name: 'View',
            icon: RiEyeLine,
            as: Link,
            to: `/items/${itemId}/view`,
          },
        ]
      : []),
    ...(edit
      ? [
          {
            name: 'Edit',
            icon: RiEdit2Line,
            as: Link,
            to: `/items/${itemId}/edit`,
          },
        ]
      : []),
    ...(deletion
      ? [
          {
            name: 'Delete',
            icon: RiDeleteBin4Line,
            dialogDetails: {
              ...details,
            },
          },
        ]
      : []),
    ...(schedule
      ? [
          {
            name: 'View Schedule',
            icon: RiCalendarEventLine,
            as: Link,
            to: `/items/${itemId}/schedule`,
          },
        ]
      : []),
  ];

  return (
    <>
      <Box>
        <MenuOptions options={options} />
      </Box>
    </>
  );
}

ItemOptions.propTypes = {
  item: PropTypes.object.isRequired,
  edit: PropTypes.bool,
  view: PropTypes.bool,
  deletion: PropTypes.bool,
  schedule: PropTypes.bool,
};

export default ItemOptions;
