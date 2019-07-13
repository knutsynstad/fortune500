function getInitialPosition(options) {
  let availableWidth  = window.innerWidth  - options.margin * 2
  let availableHeight = window.innerHeight - options.margin * 2
  let xOffset = (window.innerWidth  - options.figureSize) / 2
  let yOffset = (window.innerHeight - options.figureSize) / 2

  let initX = (availableWidth > availableHeight) ? xOffset : options.margin
  let initY = (availableWidth < availableHeight) ? yOffset : options.margin

  return [initX, initY]
}

module.exports = getInitialPosition
