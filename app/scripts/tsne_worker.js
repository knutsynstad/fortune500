import tsnejs from './libraries/tsne';

onmessage = (event) => {
  // Create a tSNE instance
  const tsne = new tsnejs.tSNE(event.data.options);

  // Provide t-SNE with distance matrix (data)
  tsne.initDataDist(event.data.data);

  // Run the algorithm for N steps.
  // For each step, send solution (array of 2D points) to main thread.
  for (let k = 0; k <= event.data.options.steps - 1; k += 1) {
    tsne.step();
    postMessage(tsne.getSolution());
  }
};
