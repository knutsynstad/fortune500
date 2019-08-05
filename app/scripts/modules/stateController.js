import { resetSettings } from './settingsManager';

const setState = (nextState) => {
  const current = document.querySelector('body').dataset;
  if (nextState === 'closed' && current.overlay !== 'none') {
    current.overlay = 'none';
  }
  current.state = nextState;
};

const setOverlay = (nextOverlay = 'none') => {
  const current = document.querySelector('body').dataset;
  if (current.state === 'open') {
    if (current.overlay === nextOverlay && current.overlay !== 'none') {
      current.overlay = 'none';
    } else {
      current.overlay = nextOverlay;
    }
  }
};

const showInstructions = () => {
  const current = document.querySelector('body').dataset;
  current.instructions = true;
  setTimeout(() => {
    current.instructions = false;
  }, 10000); // Fade away instructions after N milliseconds.
};

const createEventBindings = () => {
  // "Start exploring" button
  document.querySelector('#start')
    .addEventListener('click', () => {
      setState('open');
      showInstructions();
    }, false);

  // Share button
  document.querySelector('#share')
    .parentNode
    .addEventListener('click', () => {
      setOverlay('share');
    }, false);

  // More options button
  document.querySelector('#more')
    .parentNode
    .addEventListener('click', () => {
      setOverlay('more');
    }, false);

  // Edit visualization button
  document.querySelector('#edit')
    .parentNode
    .addEventListener('click', () => {
      setOverlay('configuration');
    }, false);

  // Reopen introduction button
  document.querySelector('#introduction-button')
    .addEventListener('click', () => {
      setState('closed');
    }, false);

  // Reopen instructions button
  document.querySelector('#instruction-button')
    .addEventListener('click', () => {
      showInstructions();
      setOverlay('none');
    }, false);

  // About button
  document.querySelector('#about-button')
    .addEventListener('click', () => {
      setOverlay('about');
    }, false);

  // Close about modal
  document.querySelector('#close-about')
    .addEventListener('click', () => {
      setOverlay('none');
    }, false);

  // Close all overlays by clicking dark tint
  document.querySelector('#overlay')
    .addEventListener('click', () => {
      setOverlay('none');
    }, false);

  // Close configuration modal
  document.querySelector('#close-configuration')
    .addEventListener('click', () => {
      setOverlay('none');
    }, false);

  // Reset settings
  document.querySelector('#reset')
    .addEventListener('click', () => {
      resetSettings();
    }, false);
};

module.exports = { createEventBindings, setOverlay, setState };
