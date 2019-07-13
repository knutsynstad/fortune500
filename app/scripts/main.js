'use strict'

import style from "../styles/main.sass"
import { createEventBindings, setOverlay } from './stateController.js'
import updateProgressBar from './progressBar.js'
import initializeAccordion from './accordion.js'
import placeStartButton from './startButton.js'
import { updateSettings, resetSettings } from './settingsManager.js'
import getInitialPosition from './getInitialPosition.js'

let options = updateSettings()
createEventBindings()
initializeAccordion()
placeStartButton(1200)

// Do the following if the window is resized
window.onresize = () => {
  placeStartButton(1200)
  options = updateSettings()
}

// Draw companies with D3
let x = d3.scaleLinear()
  .range([0, options.figureSize])

let y = d3.scaleLinear()
  .range([options.figureSize, 0])

let xAxis = d3.axisBottom()
  .scale(x)

let yAxis = d3.axisLeft()
  .scale(y)

let zoom = d3.zoom()
  .scaleExtent([1, 15])
  .on('zoom', zoomed)

let svg = d3.select('#figure')
  .call(zoom)

let rect = svg.append('rect')
  .attr('width' , '100%')
  .attr('height', '100%')
  .style('fill' , 'none')

let [initialX, initialY] = getInitialPosition(options)

let container = svg.append('g')
  .attr('id', 'logo-wrapper')

fetch('./data.json')
  .then(response => response.json())
  .then(data => {
    if (window.Worker) {
      let cache =  []
      let coords = []
      let readyToAssign = true
      let tsneWorker       = new Worker('tsne_worker.js')
      let assignmentWorker = new Worker('assignment_worker.js')
      startTSNE()

      // Prepare payload for LAP worker
      let assignmentPayload = {}
      assignmentPayload.options = options

      tsneWorker.onmessage = message => {
        coords = message.data

        // Run distances through t-sne to get 2d coords
        x.domain(d3.extent(coords, (d) => { return d[0]; })).nice()
        y.domain(d3.extent(coords, (d) => { return d[1]; })).nice()

        // Scale the t-SNE's point cloud to fit our canvas
        coords.forEach((coord) => {
          coord[0] = x(coord[0])
          coord[1] = y(coord[1])
        })
        cache.push(coords)

        if (!options.linearAssignment) {
          updatePositions()
        } else if (readyToAssign || cache.length == options.steps) {
          assignmentPayload.data = coords
          assignmentWorker.postMessage(assignmentPayload)
          readyToAssign = false
        }

        updateProgressBar(cache.length, options)
      }

      assignmentWorker.onmessage = message => {
        readyToAssign = true
        coords = message.data
        updatePositions()
      }

      function startTSNE() {
        // Get current settings
        options = updateSettings()

        // Clear cache and coords
        cache = []
        coords = []

        // Initialize coordinates array
        for (let i = 0; i < 500; i++) {
          coords.push([0,0])
        }

        // Prepare payload for t-SNE worker
        let tsnePayload = {}
        tsnePayload.data = data
        tsnePayload.options = options

        // Start t-SNE worker
        tsneWorker.postMessage(tsnePayload)
      }

      function updatePositions() {
        let t = d3.transition()
          .duration(100)

        container.selectAll('.logo')
          .data(coords)
          .transition(t)
            .attr('height', options.cellSize)
            .attr('width' , options.cellSize)
            .attr('x', d => {
              if (options.linearAssignment) {
                return initialX + d[0] + (options.padding / 2)
              } else {
                return initialX + d[0]
              }
            })
            .attr('y', d => {
              if (options.linearAssignment) {
                return initialY + d[1] + (options.padding / 2)
              } else {
                return initialY + d[1]
              }
            })
      }

      // KEEP DRAWING
      container.selectAll('.logo')
        .data(coords)
        .enter().append('image')
          .attr('class', 'logo')
          .attr('height', options.cellSize)
          .attr('width',  options.cellSize)
          .attr('xlink:href', function(d, i) {
            return `images/${(i + 1).toString().padStart(3, '0')}.png`
          })
          .attr('x', 0)
          .attr('y', 0)

      // Update visualizaton
      document.querySelector('#update')
        .addEventListener("click", () => {
          setOverlay('none')
          startTSNE()
        }, false)
    }  // Worker window end
  }); // Fetch end

// Reset settings
document.querySelector('#reset')
  .addEventListener('click', () => {
    options = resetSettings()
  }, false)

// Utility functions
function confine(num, min, max) {
  // Confines number 'num' between 'min' and 'max'
  return num <= min ? min : num >= max ? max : num
}

function zoomed() {
  // Get current applications states
  let current = document.querySelector('body').dataset

  // Only zoom/pan when figure is visible and not obscured
  if (current.state == 'open' && current.overlay == 'none') {
    let transform = d3.zoomTransform(this)
    let scale = transform.k
    let scaledSize = options.figureSize * scale
    let xLimit = window.innerWidth / 2
    let yLimit = window.innerHeight / 2
    let scaledInitX = initialX * scale
    let scaledInitY = initialY * scale

    // Confine position in each cardinal direction so that
    // the map doesn't leave the view by more than 50% of the
    // viewport width/height
    transform.x = confine(transform.x,
                          xLimit - scaledInitX - scaledSize,
                          xLimit - scaledInitX)
    transform.y = confine(transform.y,
                          yLimit - scaledInitY - scaledSize,
                          yLimit - scaledInitY)

    // Apply the transformation
    container.attr('transform', transform)
  }
}
