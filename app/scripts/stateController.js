module.exports = { createEventBindings, setOverlay }

function createEventBindings() {

  // '#start' button event binding
  document.querySelector('#start')
    .addEventListener('click', () => {
      setState('open')
      showInstructions()
    }, false)

  // Toggle '#share-modal' with '#share' parent
  document.querySelector('#share')
    .parentNode
    .addEventListener('click', () => {
      setOverlay('share')
    }, false)

  // Toggle '#more-modal' with '#more' parent
  document.querySelector('#more')
    .parentNode
    .addEventListener('click', () => {
      setOverlay('more')
    }, false)

  // Toggle '#configuration-wrapper' with '#more' parent
  document.querySelector('#edit')
    .parentNode
    .addEventListener('click', () => {
      setOverlay('configuration')
    }, false)

  // Toggle '.wrapper' with '#introduction-button'
  document.querySelector('#introduction-button')
    .addEventListener('click', () => {
      setState('closed')
    }, false)

  // Toggle '#instructions' with '#instruction-button'
  document.querySelector('#instruction-button')
    .addEventListener('click', () => {
      showInstructions()
      setOverlay('none')
    }, false)

  // Toggle '#about-modal' with '#about-button'
  document.querySelector('#about-button')
    .addEventListener('click', () => {
      setOverlay('about')
    }, false)

  document.querySelector('#close-about')
    .addEventListener('click', () => {
      setOverlay('none')
    }, false)

  // Close all overlays by clicking tint
  document.querySelector('#overlay')
    .addEventListener('click', () => {
      setOverlay('none')
    }, false)

  // Close configuration modal
  document.querySelector('#close-configuration')
    .addEventListener('click', () => {
      setOverlay('none')
    }, false)
}

function setState(nextState) {
  let current = document.querySelector('body').dataset
  
  if (nextState == 'open'
  && current.state == 'closed') {
    current.state = nextState
  }
  else if (nextState == 'closed'
  && current.state == 'open') {
    current.state = nextState
    current.overlay = 'none'
  }
}

function setOverlay(nextOverlay = 'none') {
  let current = document.querySelector('body').dataset
  
  if (current.state == 'open') {
    if (current.overlay == nextOverlay
    && current.overlay !== 'none') {
      current.overlay = 'none'
    }
    else {
      current.overlay = nextOverlay
    }
  }
}

function showInstructions() {
  let current = document.querySelector('body').dataset

  current.instructions = 'true'
  setTimeout(() => {
    current.instructions = 'false'
  }, 10000) // # of milliseconds before instructions fade away upon opening.
}
