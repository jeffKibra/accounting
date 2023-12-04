import ItemsOptions from 'containers/Management/Items/ItemOptions';
//

function createTaxDisplay(tax) {
  return tax?.name ? `${tax?.name} (${tax?.rate}%)` : '';
}

export default function getItemTableData(item, enableActions) {
  console.log({ item });
  // const { model: carModel, type } = item?.model || {};

  // delete item?.__typename;
  // delete item?.model?.__typename;

  return {
    ...item,
    // carModel,
    // type,
    tax: createTaxDisplay(item?.salesTax),
    ...(enableActions
      ? { actions: <ItemsOptions item={item} deletion edit view schedule /> }
      : {}),
  };
}
