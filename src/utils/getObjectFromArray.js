export default function getObjectFromArray(
  queryString = "",
  array = [],
  queryField = "",
  dataName = ""
) {
  const found = array.find((obj) => obj[queryField] === queryString);

  if (!found) {
    throw new Error(
      `${dataName} with ${queryField} ${queryString} not found! Check your data and try again!`
    );
  }

  return found;
}
