import linearAssignment from './modules/linearAssignment';

let working = false;
const work = [];

const startWork = (options) => {
  working = true;
  while (work.length > 0) {
    const coords = work.shift();
    postMessage(linearAssignment(coords, options));
  }
  working = false;
};

const maybeStartWork = (options) => {
  if (!working) {
    startWork(options);
  }
};

onmessage = (event) => {
  work.push(event.data.data);
  maybeStartWork(event.data.options);
};
