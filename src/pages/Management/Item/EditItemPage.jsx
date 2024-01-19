// import { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import { ITEMS } from '../../../nav/routes';

import {
  useSavedLocation,
  // useItemFormProps,
  useUpdateVehicle,
} from 'hooks';

import PageLayout from '../../../components/layout/PageLayout';

import ItemForm from 'components/forms/Item';

import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import Empty from '../../../components/ui/Empty';

function EditItemPage(props) {
  // console.log({ props });
  // const { getItem, updateItem, resetItem, loading, isModified, action, item } =
  //   props;
  useSavedLocation().setLocation();
  // const { accounts, taxes, loading: loadingFormProps } = useItemFormProps();

  const location = useLocation();
  const { itemId } = useParams();
  const navigate = useNavigate();

  const { updating, updateVehicle, vehicle, loading } =
    useUpdateVehicle(itemId);
  console.log({ loading, vehicle });

  // useEffect(() => {
  //   getItem(itemId);
  // }, [getItem, itemId]);

  function handleSubmit(data) {
    if (Object.keys(data).length === 0) {
      //no form data has been changed. redirect to ITEMS page
      return navigate(ITEMS);
    }

    updateVehicle(data);
  }

  return (
    <PageLayout
      pageTitle="Edit Vehicle"
      breadcrumbLinks={{
        Dashboard: '/',
        Vehicles: ITEMS,
        [itemId]: location.pathname,
      }}
    >
      {loading ? (
        <SkeletonLoader />
      ) : vehicle ? (
        <ItemForm
          updating={updating}
          item={vehicle}
          onSubmit={handleSubmit}
          // accounts={accounts}
          // taxes={taxes || []}
        />
      ) : (
        <Empty
          message={
            !vehicle ? 'vehicle Data not found!' : 'Accounts data missing!'
          }
        />
      )}
    </PageLayout>
  );
}

export default EditItemPage;
