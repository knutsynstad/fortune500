import { setState } from './stateController';

const externalProgress = document.querySelector('.entry-state');
const internalProgress = document.querySelector('.calculating-state');
const internalProgressWrapper = document.querySelector('#calculating');

const updateProgressBar = (step, options) => {
  const { steps } = options;
  const percentage = Math.round((step / steps) * 100);
  const progress = `Step ${step} of ${steps} (${percentage}%)`;

  externalProgress.innerText = progress;
  internalProgress.innerText = progress;

  if (step === 1) {
    internalProgressWrapper.classList.add('visible');
  } else if (step === steps) {
    internalProgressWrapper.classList.remove('visible');
    const current = document.querySelector('body').dataset;
    if (current.state === 'loading') {
      setState('closed');
    } else {
      setState('open');
    }
  }
};

module.exports = updateProgressBar;
