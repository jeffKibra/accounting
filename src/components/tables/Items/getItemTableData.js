function createTaxDisplay(tax) {
  return tax?.name ? `${tax?.name} (${tax?.rate}%)` : '';
}

export default function getItemTableData(item) {
  const { model: modelDetails, year } = item;
  const { make, model } = modelDetails;
  return {
    ...item,
    carModel: `${model} (${year})`,
    carMake: make,
    tax: createTaxDisplay(item?.salesTax),
  };
}
