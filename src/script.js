'use strict';

const box = document.querySelector('#box')
const firstRowDiv = document.querySelector('.row')
const linesCounterDiv = document.querySelector('#lines')
const cellsCounterDiv = document.querySelector('#cells')
const itemsCount = prompt('Сколько элементов в строке?', 100)
const speed = 1000 / prompt('С какой частотой выводить строки? (Гц)', 5)
const maxRow = prompt('Cколько вывести строк?', 100)

// automatos
// http://atlas.wolfram.com/01/01/
const processers = [
  [1,0,0,0,1,0,0,1],
  [1,1,0,1,1,0,1,0],
  [0,0,0,1,0,1,1,0],
  [0,1,1,0,1,1,0,1],
  [0,1,0,0,1,0,0,1]
]

const processer = getRandomElFromArr(processers)

function getRandomElFromArr(arr) {
  let randomI = Math.floor(Math.random()*processers.length)
  return arr[randomI]
}

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

function processRow(rowDiv, parentRowDiv) {
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
  processRow(clone, lastrow)
  box.appendChild(clone)
}

function tick(maxRow) {
  let countOfRows = document.querySelectorAll('.row').length
  if (countOfRows > maxRow) return true
  linesCounterDiv.innerHTML = `${countOfRows} lines`
  cellsCounterDiv.innerHTML = `${countOfRows * itemsCount} cells`
  dublicateRow()
}

function createFirstRow(row) {
  for (let i = 0; i < itemsCount; i++) {
    let div = document.createElement('div');
    ['flex-basis', 'height'].map(property => {
      div.style[property] = calculateBlockSize()
    })
    row.appendChild(div)
  }
}

createFirstRow(firstRowDiv)
randomizeRow(firstRowDiv)
let interval = setInterval(_ => {
  if (tick(maxRow)) clearInterval(interval)
}, speed)
