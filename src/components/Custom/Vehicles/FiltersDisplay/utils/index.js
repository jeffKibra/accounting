export function checkIfRangeIsValid(range) {
  let isValid = false;

  const arrayIsValid = Array.isArray(range) && range.length === 2;
  if (arrayIsValid) {
    //confirm values are numbers
    const min = range[0];
    const max = range[1];

    isValid = typeof min === 'number' && typeof max === 'number';
  }

  //   console.log({ range, isValid });

  return isValid;
}
