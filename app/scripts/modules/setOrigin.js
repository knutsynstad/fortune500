const setOrigin = (options) => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const availableWidth = width - options.margin * 2;
  const availableHeight = height - options.margin * 2;
  const xOffset = (width - options.figureSize) / 2;
  const yOffset = (height - options.figureSize) / 2;

  const initialX = (availableWidth > availableHeight) ? xOffset : options.margin;
  const initialY = (availableWidth < availableHeight) ? yOffset : options.margin;

  return [initialX, initialY];
};

module.exports = setOrigin;
