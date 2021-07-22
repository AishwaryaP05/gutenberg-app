export const findValueByPrefix = (object, prefix, multiple) => {
  var returnArr = [];
  for (var property in object) {
    if (
      object.hasOwnProperty(property) &&
      property.toString().startsWith(prefix)
    ) {
      if (multiple) {
        returnArr.push(object[property]);
      } else return object[property];
    }
  }
};
