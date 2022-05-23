/**
 *
 * @param {*} a
 * @param {*} b
 * @param {"asc"||"desc"} direction
 * @returns values to sort arry
 */
export function sortStrings(a, b, direction = "asc") {
  if (direction === "desc") {
    if (b < a) {
      //b is less than a
      return -1;
    }
    if (b > a) {
      //b is greater than a
      return 1;
    }
    //b and a are equal
    return 0;
  } else {
    if (a < b) {
      //a is less than b
      return -1;
    }
    if (a > b) {
      //a is greater than b
      return 1;
    }
    //a and b are equal
    return 0;
  }
}
