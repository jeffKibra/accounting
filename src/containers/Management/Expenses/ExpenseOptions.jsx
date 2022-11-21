import { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { RiDeleteBin4Line, RiEdit2Line, RiEyeLine } from 'react-icons/ri';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { useDeleteExpense } from '../../../hooks';

import MenuOptions from '../../../components/ui/MenuOptions';

function ExpenseOptions(props) {
  const { expense, edit, view, deletion } = props;
  const { expenseId } = expense;
  const { details, isDeleted, resetExpense } = useDeleteExpense(expense);

  useEffect(() => {
    if (isDeleted) {
      resetExpense();
    }
  }, [isDeleted, resetExpense]);

  const options = [
    ...(view
      ? [
          {
            name: 'View',
            icon: RiEyeLine,
            as: Link,
            to: `/purchase/expenses/${expenseId}/view`,
          },
        ]
      : []),
    ...(edit
      ? [
          {
            name: 'Edit',
            icon: RiEdit2Line,
            as: Link,
            to: `/purchase/expenses/${expenseId}/edit`,
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
  ];

  return (
    <>
      <Box>
        <MenuOptions options={options} />
      </Box>
    </>
  );
}

ExpenseOptions.propTypes = {
  expense: PropTypes.object.isRequired,
  edit: PropTypes.bool,
  view: PropTypes.bool,
  deletion: PropTypes.bool,
};

export default ExpenseOptions;
