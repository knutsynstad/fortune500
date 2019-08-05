// Import styles for webpack
import style from '../styles/main.sass';

// Import components
import { createEventBindings, setOverlay } from './modules/stateController';
import updateProgressBar from './modules/progressBar';
import initializeAccordion from './modules/accordion';
import placeStartButton from './modules/startButton';
import { getSettings } from './modules/settingsManager';
import setOrigin from './modules/setOrigin';
import confine from './modules/confine';
import initializeArray from './modules/initializeArray';

let step = 0;
let coords = initializeArray(500, [0, 0]);
let options = getSettings();
let readyToAssign = true;
const tsneWorker = new Worker('./tsne_worker.js');
const assignmentWorker = new Worker('./assignment_worker.js');

createEventBindings(options);
initializeAccordion();
placeStartButton(1200);

// Draw companies with D3
const x = d3.scaleLinear().range([0, options.figureSize]);
const y = d3.scaleLinear().range([options.figureSize, 0]);
let [initialX, initialY] = setOrigin(options);

const zoom = d3.zoom()
  .scaleExtent([1, 15])
  .on('zoom', zoomed);

const svg = d3.select('#figure')
  .call(zoom);

const container = svg.append('g')
  .attr('id', 'logo-wrapper');

container.selectAll('.logo')
  .data(coords)
  .enter()
  .append('image')
  .attr('class', 'logo')
  .attr('xlink:href', (d, i) => `images/${(i + 1).toString().padStart(3, '0')}.png`);

const startTSNE = (data) => {
  options = getSettings();
  step = 0;
  coords = initializeArray(500, [0, 0]);
  tsneWorker.postMessage({ data, options });
};

const updatePositions = (data) => {
  const t = d3.transition()
    .duration(100);

  container.selectAll('.logo')
    .data(data)
    .transition(t)
    .attr('height', options.cellSize)
    .attr('width', options.cellSize)
    .attr('x', (d) => {
      if (options.linearAssignment) {
        return initialX + d[0] + (options.padding / 2);
      }
      return initialX + d[0];
    })
    .attr('y', (d) => {
      if (options.linearAssignment) {
        return initialY + d[1] + (options.padding / 2);
      }
      return initialY + d[1];
    });
};

fetch('./data.json')
  .then(response => response.json())
  .then((data) => {
    if (window.Worker) {
      startTSNE(data);
      tsneWorker.onmessage = (message) => {
        coords = message.data;
        step += 1;

        // Find min and max values (extent)
        x.domain(d3.extent(coords, d => d[0])).nice();
        y.domain(d3.extent(coords, d => d[1])).nice();

        // Scale the t-SNE's point cloud to fit canvas
        coords = coords.map(coord => [x(coord[0]), y(coord[1])]);

        if (!options.linearAssignment) {
          updatePositions(coords);
        } else if (readyToAssign || step === options.steps) {
          assignmentWorker.postMessage({ options, data: coords });
          readyToAssign = false;
        }

        updateProgressBar(step, options);
      };

      assignmentWorker.onmessage = (message) => {
        readyToAssign = true;
        coords = message.data;
        updatePositions(coords);
      };

      document.querySelector('#update')
        .addEventListener('click', () => {
          setOverlay('none');
          startTSNE(data);
        }, false);
    }
  }); // Fetch end

function zoomed() {
  // Get current application states
  const current = document.querySelector('body').dataset;

  // Only zoom/pan when figure is visible and not obscured
  if (current.state === 'open' && current.overlay === 'none') {
    const transform = d3.zoomTransform(this);
    const scale = transform.k;
    const scaledSize = options.figureSize * scale;
    const xLimit = window.innerWidth / 2;
    const yLimit = window.innerHeight / 2;
    const scaledInitialX = initialX * scale;
    const scaledInitialY = initialY * scale;

    // Confine position in each cardinal direction so that
    // the map doesn't leave the view by more than 50% of the
    // viewport width/height
    transform.x = confine(
      transform.x,
      xLimit - scaledInitialX - scaledSize,
      xLimit - scaledInitialX,
    );
    transform.y = confine(
      transform.y,
      yLimit - scaledInitialY - scaledSize,
      yLimit - scaledInitialY,
    );

    // Apply the transformation
    container.attr('transform', transform);
  }
}

window.onresize = () => {
  placeStartButton(1200);
  options = getSettings();
  [initialX, initialY] = setOrigin(options);
};
