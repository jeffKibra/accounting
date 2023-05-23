import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { connect } from 'react-redux';

//
import { GET_ITEM } from 'store/actions/itemsActions';
//
import { ITEMS } from 'nav/routes';
//
import PageLayout from 'components/layout/PageLayout';
import SkeletonLoader from 'components/ui/SkeletonLoader';
import Empty from 'components/ui/Empty';
//
import useSavedLocation from '../../../hooks/useSavedLocation';
//
import ViewItem from 'containers/Management/Items/ViewItem';

function ViewItemPage(props) {
  const { getItem, loading, item } = props;

  const { itemId } = useParams();

  const location = useLocation();
  useSavedLocation().setLocation();

  useEffect(() => {
    getItem(itemId);
  }, [getItem, itemId]);

  return (
    <PageLayout
      pageTitle="Items Details"
      //   actions={
      //     <Link to={`${location.pathname}/new`}>
      //       <Button leftIcon={<RiAddLine />} colorScheme="cyan" size="sm">
      //         New Item
      //       </Button>
      //     </Link>
      //   }
      breadcrumbLinks={{
        Dashboard: '/',
        Items: ITEMS,
        [itemId]: location.pathname,
      }}
    >
      {loading ? (
        <SkeletonLoader />
      ) : item ? (
        <ViewItem item={item} />
      ) : (
        <Empty message={'Item Data not found!'} />
      )}
    </PageLayout>
  );
}

function mapStateToProps(state) {
  const { loading, isModified, action, item } = state.itemsReducer;

  return { loading, isModified, action, item };
}

function mapDispatchToProps(dispatch) {
  return {
    getItem: itemId => dispatch({ type: GET_ITEM, payload: itemId }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewItemPage);
