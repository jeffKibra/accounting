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
import CustomAlert from 'components/ui/CustomAlert';
//
import useSavedLocation from '../../../hooks/useSavedLocation';
//
import ViewItemSchedule from 'containers/Management/Items/ViewItemSchedule';

function ViewItemSchedulePage(props) {
  const { getItem, loading, item, error } = props;

  const { itemId } = useParams();

  const location = useLocation();
  useSavedLocation().setLocation();

  useEffect(() => {
    getItem(itemId);
  }, [getItem, itemId]);

  return (
    <PageLayout
      pageTitle="Vehicle Schedule"
      //   actions={
      //     <Link to={`${location.pathname}/new`}>
      //       <Button leftIcon={<RiAddLine />} colorScheme="cyan" size="sm">
      //         New vehicle
      //       </Button>
      //     </Link>
      //   }
      breadcrumbLinks={{
        Dashboard: '/',
        Vehicles: ITEMS,
        [itemId]: location.pathname,
      }}
    >
      {loading ? (
        <SkeletonLoader />
      ) : error ? (
        <CustomAlert
          status="error"
          title="Error fetching Car Data"
          description={error?.message || 'Unknown Error!'}
        />
      ) : item ? (
        <ViewItemSchedule item={item} />
      ) : (
        <Empty message={'vehicle Data not found!'} />
      )}
    </PageLayout>
  );
}

function mapStateToProps(state) {
  const { loading, isModified, action, item, error } = state.itemsReducer;

  return { loading, isModified, action, item, error };
}

function mapDispatchToProps(dispatch) {
  return {
    getItem: itemId => dispatch({ type: GET_ITEM, payload: itemId }),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewItemSchedulePage);
