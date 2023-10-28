import ItemsOptions from 'containers/Management/Items/ItemOptions';
//

function createTaxDisplay(tax) {
  return tax?.name ? `${tax?.name} (${tax?.rate}%)` : '';
}

export default function getItemTableData(item, enableActions) {
  // console.log({ item });
  const modelObject = item?.model || {};
  const { model, type } = modelObject;

  return {
    ...item,
    modelObject,
    model,
    type,
    tax: createTaxDisplay(item?.salesTax),
    ...(enableActions
      ? { actions: <ItemsOptions item={item} deletion edit view schedule /> }
      : {}),
  };
}
