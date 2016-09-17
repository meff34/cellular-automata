'use strict';

const box = document.querySelector('#box')
const linesCounterDiv = document.querySelector('#lines')
const cellsCounterDiv = document.querySelector('#cells')
const navDiv = document.querySelector('#nav')
let automatoInterval

const itemsCount = 250
const speed = 120
const maxRow = prompt('height', 100)

// automatos
// http://atlas.wolfram.com/01/01/
const processers = [
  [1,0,0,0,1,0,0,1],
  [1,1,0,1,1,0,1,0],
  [0,0,0,1,0,1,1,0],
  [0,1,1,0,1,1,0,1],
  [0,1,0,0,1,0,0,1]
]

function randomBin() {
  return Math.random() > .5 ? 1 : 0
}

function calculateBlockSize() {
  let width = document.querySelector('body').clientWidth
  return `${width / itemsCount}px`
}

function randomizeRow(rowNode) {
  for (let i = 0; i < rowNode.childNodes.length; i++) {
    let div = rowNode.childNodes[i]
    div.className = ""
    div.classList.add(randomBin() ? 'active' : 'inactive')
  }
}

function processRow(rowDiv, parentRowDiv, processer) {
  for (let i = 0; i < itemsCount; i++) {
    let target = rowDiv.childNodes[i]
    let prevSelf = parentRowDiv.childNodes[i]
    let leftSibling =
      prevSelf.previousElementSibling ||
      parentRowDiv.childNodes[
        parentRowDiv.childNodes.length - 1]
    let rightSibling =
      prevSelf.nextElementSibling ||
      parentRowDiv.childNodes[0]

    if (
      isActive(leftSibling) &&
      isActive(prevSelf) &&
      isActive(rightSibling)
    ) {
      setClass(target, processer[0])
    } else if (
      isActive(leftSibling) &&
      isActive(prevSelf) &&
      !isActive(rightSibling)
    ) {
      setClass(target, processer[1])
    } else if (
      isActive(leftSibling) &&
      !isActive(prevSelf) &&
      isActive(rightSibling)
    ) {
      setClass(target, processer[2])
    } else if (
      isActive(leftSibling) &&
      !isActive(prevSelf) &&
      !isActive(rightSibling)
    ) {
      setClass(target, processer[3])
    } else if (
      !isActive(leftSibling) &&
      isActive(prevSelf) &&
      isActive(rightSibling)
    ) {
      setClass(target, processer[4])
    } else if (
      isActive(leftSibling) &&
      !isActive(prevSelf) &&
      isActive(rightSibling)
    ) {
      setClass(target, processer[5])
    } else if (
      !isActive(leftSibling) &&
      !isActive(prevSelf) &&
      isActive(rightSibling)
    ) {
      setClass(target, processer[6])
    } else if (
      !isActive(leftSibling) &&
      !isActive(prevSelf) &&
      !isActive(rightSibling)
    ) {
      setClass(target, processer[7])
    }

  }
}

function setClass(cell, isActive) {
  cell.classList = ""
  cell.classList.add(isActive ? 'active' : 'inactive')
}

function isActive(cell) {
  return cell.classList.contains('active')
}

function dublicateRow() {
  let rows = document.querySelectorAll('.row')
  let lastrow = rows[rows.length - 1]
  let clone = lastrow.cloneNode(true)
  randomizeRow(clone);
  box.appendChild(clone)
  return [clone, lastrow]
}

function calculateElements() {
  let countOfRows = document.querySelectorAll('.row').length
  linesCounterDiv.innerHTML = `${countOfRows} lines`
  cellsCounterDiv.innerHTML = `${countOfRows * itemsCount} cells`
}

function tick(maxRow, processer) {
  const [clone, lastrow] = dublicateRow()
  calculateElements()
  processRow(clone, lastrow, processer)
}

function fillFirstRow(row) {
  for (let i = 0; i < itemsCount; i++) {
    let div = document.createElement('div');
    ['flex-basis', 'height'].map(property => {
      div.style[property] = calculateBlockSize()
    })
    row.appendChild(div)
  }
}

function startAutomato(ruleset) {
  const firstRowDiv = document.createElement('div')
  firstRowDiv.classList.add('row')
  box.appendChild(firstRowDiv)
  fillFirstRow(firstRowDiv)
  randomizeRow(firstRowDiv)
  automatoInterval = setInterval(() => {
    let countOfRows = document.querySelectorAll('.row').length
    if (countOfRows > maxRow) return clearInterval(automatoInterval)
    tick(maxRow, ruleset)
  }, speed)
}

function generateButtons() {
  processers.map((processer, i) => {
    let button = document.createElement('button')
    button.innerHTML = `rule #${i + 1}`
    button.addEventListener('click', () => {
      stopAutomato()
      startAutomato(processer)
    })
    navDiv.appendChild(button)
  })
}

function stopAutomato() {
  clearInterval(automatoInterval)
  box.innerHTML = ''
}

generateButtons()
startAutomato(processers[0])
