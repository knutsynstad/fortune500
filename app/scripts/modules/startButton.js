const placeStartButton = (wrapperWidth) => {
  const entry = document.querySelector('#entry');
  const width = window.innerWidth - 15;
  const rightOffset = width - wrapperWidth > 200 ? (width - wrapperWidth) / 2 : 100;

  entry.style.right = `${rightOffset}px`;
};

module.exports = placeStartButton;
