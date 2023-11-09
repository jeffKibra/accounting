export { default as generateQueryVariables } from './generateQueryVariables';

export function createObjectIdsToExcludeFilterFromArray(stringsArray = []) {
  function getStringFilter(itemId) {
    return `NOT objectID:${itemId}`;
  }

  let combinedString = '';

  const firstString = stringsArray[0];
  if (firstString) {
    combinedString = getStringFilter(firstString);
  }

  if (Array.isArray(stringsArray) && stringsArray.length > 0) {
    stringsArray.forEach((string, i) => {
      //skip first string as it is used for initialization
      if (i === 0) {
        return;
      }

      // console.log({ i });
      combinedString += ` AND ${getStringFilter(string)}`;
    });
  }

  // console.log({ combinedString, stringsArray });

  return String(combinedString).trim();
}
