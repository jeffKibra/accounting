export function sortStrings(a: string, b: string, direction: string = "asc") {
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

interface DirtyFields {
  [key: string]: boolean;
}

interface FormValues {
  [key: string]: string | number;
}

export function getDirtyFields(
  dirtyFields: DirtyFields,
  formValues: FormValues
) {
  return Object.keys(dirtyFields).reduce((fields: FormValues, key) => {
    if (dirtyFields[key] === true) {
      return {
        ...fields,
        [key]: formValues[key],
      };
    } else {
      return fields;
    }
  }, {});
}