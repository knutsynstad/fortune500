let defaultOptions = {
  'steps' : 250, // solution gets better with every step (25 = default)
  'epsilon' : 10, // epsilon is learning rate (10 = default)
  'perplexity' : 15, // roughly how many neighbors each point influences (30 = default)
  'dim' : 2, // dimensionality of the embedding (2 = default)
  'padding' : 2, // padding between logos
  'linearAssignment' : true, // do linear assignment?
  'cellsPerSide' : 30, // cells per side in the grid
  'cellSize' : 10, // logo size when linear assignment is disabled
  'figureSize' : 1000,
  'margin' : 90
}

function updateSettings() {
  // Get default settings
  let options = defaultOptions

  // Validate settings
  validateSettings()

  // Update based on user settings
  let inputs = document.querySelectorAll('.variable input')
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].type === 'number') {
      options[inputs[i].id] = Number(inputs[i].value)
    } else if (inputs[i].type === 'checkbox') {
      options[inputs[i].id] = inputs[i].checked
    }
  }

  options.figureSize = Math.min(window.innerWidth  - options.margin * 2,
                                window.innerHeight - options.margin * 2)

  options.cellSize = options.figureSize / options.cellsPerSide

  if (options.linearAssignment) {
    options.cellSize = options.cellSize - options.padding
  }

  // Return updated options object
  return options
}

function resetSettings() {
  let options = defaultOptions

  // Reset settings form fields
  document.querySelector('#epsilon').value = options.epsilon
  document.querySelector('#perplexity').value = options.perplexity
  document.querySelector('#steps').value = options.steps
  document.querySelector('#linearAssignment').checked = options.linearAssignment
  document.querySelector('#cellsPerSide').value = options.cellsPerSide
  document.querySelector('#padding').value = options.padding

  // Return default options object
  return options
}

function validateSettings() {
  // Limit the value of the following inputs
  let inputs = ['#epsilon', '#perplexity', '#steps', '#cellsPerSide', '#padding']
  
  for (let i = 0; i < inputs.length; i++) {
    let input = document.querySelector(inputs[i])
    input.addEventListener('change', event => {
      let num = Number(input.value)
      let min = Number(input.min)
      let max = Number(input.max)
      input.value = num <= min ? min : num >= max ? max : num
    }, false)
  }
}


module.exports = { updateSettings, resetSettings }
