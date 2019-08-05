import lap from '../libraries/lap';

// Calculate the Euclidean distance between a[x,y] and b[x,y]
const getDistance = (a, b) => {
  const abX = (a[0] - b[0]) ** 2;
  const abY = (a[1] - b[1]) ** 2;
  const distance = abX + abY;
  return Math.sqrt(distance);
};

const getRowCost = (cell, grid) => {
  const distances = [];
  const count = grid.length;
  for (let pos = 0; pos < count; pos += 1) {
    const dist = getDistance(
      [cell[0], cell[1]],
      [grid[pos][0], grid[pos][1]],
    );
    distances.push(dist);
  }
  return distances;
};

const linearAssignment = (data, options) => {
  const cellCount = options.cellsPerSide ** 2;
  const cellSize = options.figureSize / options.cellsPerSide;
  const output = [];

  // To calculate a cost matrix we first need something to calculate the cost against.
  // We're creating our grid (cellCoordinates) of size (cellCount) and calculate the
  // x and y positions of all cells.

  const cellCoordinates = new Array(cellCount);
  for (let cell = 0; cell < cellCount; cell += 1) {
    const x = (cell % options.cellsPerSide) * cellSize;
    const y = Math.floor(cell / options.cellsPerSide) * cellSize;
    cellCoordinates[cell] = [x, y];
  }

  // Create a cost matrix for all logos with the distance between it,
  // and every cell in the grid.
  const costMatrix = [];
  for (let i = 0; i < cellCount; i += 1) {
    if (i < 500) {
      costMatrix.push(getRowCost(data[i], cellCoordinates));
    } else {
      costMatrix.push(new Array(cellCount).fill(0));
    }
  }

  // Output from LAP-JV algorithm
  const lapGrid = lap(cellCount, costMatrix);

  // Transform LAP-JV output to array of co-ordinates [[x, y], [x, y], ...]
  for (let i = 0; i < data.length; i += 1) {
    const index = lapGrid.col.indexOf(i);
    const x = (index % options.cellsPerSide) * cellSize;
    const y = Math.floor(index / options.cellsPerSide) * cellSize;
    output.push([x, y]);
  }
  return output;
};

module.exports = linearAssignment;
