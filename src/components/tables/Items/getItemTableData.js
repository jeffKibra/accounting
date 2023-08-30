function createTaxDisplay(tax) {
  return tax?.name ? `${tax?.name} (${tax?.rate}%)` : '';
}

export default function getItemTableData(item) {
  // console.log({ item });
  const { year } = item;
  const modelDetails = item?.model || {};

  const { make, model, type } = modelDetails;
  return {
    ...item,
    carModel: `${model || ''} (${year || ''})`,
    type,
    carMake: make,
    tax: createTaxDisplay(item?.salesTax),
  };
}
