import { Component } from 'react';
import { connect } from 'react-redux';

import { GET_ITEMS, DELETE_ITEM } from '../../../store/actions/itemsActions';
import { reset } from '../../../store/slices/itemsSlice';

import Empty from '../../../components/ui/Empty';
import SkeletonLoader from '../../../components/ui/SkeletonLoader';

import ItemsTable from '../../../components/tables/Items/ItemsTable';

class ItemsList extends Component {
  componentDidMount() {
    this.props.getItems();
  }

  componentDidUpdate(prevProps) {
    const { isModified, resetItem, getItems } = this.props;

    if (isModified) {
      //reset
      resetItem();
      //refetch items
      getItems();
    }
  }

  render() {
    const { loading, items, action, isModified, error, deleteItem } =
      this.props;
    // console.log({ items, loading, error });

    // return loading && action === GET_ITEMS ? (
    //   <SkeletonLoader loading={loading} />
    // ) : items && items.length > 0 ? (
    //   <ItemsTable
    //     isDeleted={isModified}
    //     handleDelete={deleteItem}
    //     deleting={loading && action === DELETE_ITEM}
    //     items={items}
    //     loading={}
    //   />
    // ) : (
    //   <Empty />
    // );

    return (
      <ItemsTable
        isDeleted={isModified}
        handleDelete={deleteItem}
        deleting={loading && action === DELETE_ITEM}
        items={items || []}
        loading={loading && action === GET_ITEMS}
        error={error}
      />
    );
  }
}

function mapStateToProps(state) {
  const { loading, error, items, action, isModified } = state.itemsReducer;

  return { loading, error, items, action, isModified };
}

function mapDispatchToProps(dispatch) {
  return {
    getItems: () => dispatch({ type: GET_ITEMS }),
    deleteItem: itemId => dispatch({ type: DELETE_ITEM, payload: itemId }),
    resetItem: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemsList);
