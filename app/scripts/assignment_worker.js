import linearAssignment from './linearAssignment.js'

let working = false
const work = []

onmessage = event => {
  work.push(event.data.data)
  maybeStartWork(event.data.options)
}

function startWork (options) {
  working = true
  
  while (work.length > 0) {
    const coords = work.shift()
    postMessage(linearAssignment(coords, options))
  }
  working = false
}

function maybeStartWork (options) {
  if (!working) {
    startWork(options)
  }
}
