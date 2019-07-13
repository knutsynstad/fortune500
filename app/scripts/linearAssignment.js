import lap from './libraries/lap.js'

/*

Combinatorial optimization

Implementation of R. Jonker and A. Volgenant’s Linear Assignment Problem Algorithm (LAP-JV).
Transforms the point cloud output of the t-SNE algorithm to a linear grid.
JavaScript library by Philippe Rivière (https://github.com/Fil/lap-jv)

The LAP-JV algorithm assumes an equal number of agents (logos) and tasks (grid cells)
To achieve a more visually interesting presentation, highlighting clusters and data shape,
we want more tasks (grid cells) than agents (logos).

This is achieved by creating dummy agents to balance the number of agents and tasks for
any arbitrary grid size.

*/

function linearAssignment(data, options) {

  let cellCount = Math.pow(options.cellsPerSide, 2)
  let cellSize  = options.figureSize / options.cellsPerSide
  let output    = []

  // To calculate a cost matrix we first need something to calculate the cost against.
  // We're creating our grid (cellCoordinates) of size (cellCount) and calculate the
  // x and y positions of all cells.

  let cellCoordinates = new Array(cellCount)
  for (let cell = 0; cell < cellCount; cell++) {
    let x = (cell % options.cellsPerSide) * cellSize
    let y = Math.floor(cell / options.cellsPerSide) * cellSize
    cellCoordinates[cell] = [x, y]
  }

  // Create a cost matrix for all logos with the distance between it,
  // and every cell in the grid.
  let costMatrix = []
  for (let i = 0; i < cellCount; i++) {
    if (i < 500) {
      costMatrix.push(getRowCost(data[i], cellCoordinates))
    } else {
      costMatrix.push(new Array(cellCount).fill(0))
    }
  }

  // Output from LAP-JV algorithm
  let lapGrid = lap(cellCount, costMatrix);

  // Transform LAP-JV output to array of co-ordinates [[x, y], [x, y], ...]
  for (let i = 0; i < data.length; i++) {
    let index = lapGrid.col.indexOf(i)
    let x = (index % options.cellsPerSide) * cellSize
    let y = Math.floor(index / options.cellsPerSide) * cellSize
    output.push([x, y])
  }

  return output
}

module.exports = linearAssignment

// Internal helper functions
function getDistance(a, b) {
  // Calculate the Euclidean distance between a[x,y] and b[x,y]
  let abX = Math.pow(a[0] - b[0], 2)
  let abY = Math.pow(a[1] - b[1], 2)
  return Math.sqrt(abX + abY)
}

function getRowCost(cell, grid) {
  let distances = []
  let count = grid.length
  for (let pos = 0; pos < count; pos++) {
    let dist = getDistance([cell[0], cell[1]],
                           [grid[pos][0], grid[pos][1]])
    distances.push(dist)
  }
  return distances
}
