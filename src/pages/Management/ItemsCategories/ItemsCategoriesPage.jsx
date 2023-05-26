import { Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

import * as routes from '../../../nav/routes';
import PageLayout from '../../../components/layout/PageLayout';

import ItemsCategories from '../../../containers/Management/ItemsCategories/ItemsCategories';

function ItemsCategoriesPage() {
  return (
    <PageLayout
      pageTitle="Items Categories"
      actions={
        <Link to={routes.NEW_VEHICLE_CATEGORY}>
          <Button>new Category</Button>
        </Link>
      }
    >
      <ItemsCategories />
    </PageLayout>
  );
}

export default ItemsCategoriesPage;
