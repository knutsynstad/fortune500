const initializeArray = (length, value) => {
  const array = [];
  for (let i = 0; i < length; i += 1) {
    array.push(value);
  }
  return array;
};

module.exports = initializeArray;
