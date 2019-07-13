let externalProgress = document.querySelector('.entry-state')
let internalProgress = document.querySelector('.calculating-state')
let internalProgressWrapper = document.querySelector("#calculating")

function updateProgressBar(step, options) {
  let steps = options.steps
  let percentage = Math.round((step / steps) * 100)
  let progress = `Step ${step} of ${steps} (${percentage}%)`

  externalProgress.innerText = progress
  internalProgress.innerText = progress

  if (step == 1) {
    internalProgressWrapper.classList.add('visible')
  } else if (step == steps) {
    internalProgressWrapper.classList.remove('visible')
    let current = document.querySelector('body').dataset

    if (current.state == 'loading') {
      current.state = 'closed'
    } else {
      current.state = 'open'
    }
  }
}

module.exports = updateProgressBar
