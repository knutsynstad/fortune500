import confine from './confine';

const defaultOptions = {
  steps: 250, // solution gets better with every step
  epsilon: 10, // learning rate
  perplexity: 15, // roughly how many neighbors each point influences (30 = default)
  dim: 2, // dimensionality of the embedding
  padding: 2, // padding between logos
  linearAssignment: true, // enable linear assignment?
  cellsPerSide: 30, // cells per side in the grid
  cellSize: 10, // logo size when linear assignment is disabled
  figureSize: 1000,
  margin: 90,
};

const validateSettings = () => {
  // Limit the value of the following inputs
  const inputs = [
    '#epsilon',
    '#perplexity',
    '#steps',
    '#cellsPerSide',
    '#padding',
  ];

  inputs.forEach((input) => {
    const element = document.querySelector(input);
    element.addEventListener('change', () => {
      element.value = confine(
        Number(element.value),
        Number(element.min),
        Number(element.max),
      );
    }, false);
  });
};

const getSettings = () => {
  const inputs = document.querySelectorAll('.variable input');
  const options = defaultOptions;
  validateSettings();

  // Update options based on user settings
  inputs.forEach((input) => {
    if (input.type === 'number') {
      options[input.id] = Number(input.value);
    }
    if (input.type === 'checkbox') {
      options[input.id] = input.checked;
    }
  });

  options.figureSize = Math.min(
    window.innerWidth - options.margin * 2,
    window.innerHeight - options.margin * 2,
  );
  options.cellSize = options.figureSize / options.cellsPerSide;

  if (options.linearAssignment) {
    options.cellSize -= options.padding;
  }

  return options;
};

const resetSettings = () => {
  const options = defaultOptions;

  // Reset settings input fields
  document.querySelector('#epsilon').value = options.epsilon;
  document.querySelector('#perplexity').value = options.perplexity;
  document.querySelector('#steps').value = options.steps;
  document.querySelector('#linearAssignment').checked = options.linearAssignment;
  document.querySelector('#cellsPerSide').value = options.cellsPerSide;
  document.querySelector('#padding').value = options.padding;
};

module.exports = { getSettings, resetSettings };
