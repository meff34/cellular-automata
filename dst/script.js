'use strict';

var box = document.querySelector('#box');
var firstRowDiv = document.querySelector('.row');
var linesCounterDiv = document.querySelector('#lines');
var cellsCounterDiv = document.querySelector('#cells');
var itemsCount = prompt('Сколько элементов в строке?', 100);
var speed = 1000 / prompt('С какой частотой выводить строки? (Гц)', 5);
var maxRow = prompt('Cколько вывести строк?', 100);

// automatos
// http://atlas.wolfram.com/01/01/
var processers = [[1, 0, 0, 0, 1, 0, 0, 1], [1, 1, 0, 1, 1, 0, 1, 0], [0, 0, 0, 1, 0, 1, 1, 0], [0, 1, 1, 0, 1, 1, 0, 1], [0, 1, 0, 0, 1, 0, 0, 1]];

var processer = getRandomElFromArr(processers);

function getRandomElFromArr(arr) {
  var randomI = Math.floor(Math.random() * processers.length);
  return arr[randomI];
}

function randomBin() {
  return Math.random() > .5 ? 1 : 0;
}

function calculateBlockSize() {
  var width = document.querySelector('body').clientWidth;
  return width / itemsCount + 'px';
}

function randomizeRow(rowNode) {
  for (var i = 0; i < rowNode.childNodes.length; i++) {
    var div = rowNode.childNodes[i];
    div.className = "";
    div.classList.add(randomBin() ? 'active' : 'inactive');
  }
}

function processRow(rowDiv, parentRowDiv) {
  for (var i = 0; i < itemsCount; i++) {
    var target = rowDiv.childNodes[i];
    var prevSelf = parentRowDiv.childNodes[i];
    var leftSibling = prevSelf.previousElementSibling || parentRowDiv.childNodes[parentRowDiv.childNodes.length - 1];
    var rightSibling = prevSelf.nextElementSibling || parentRowDiv.childNodes[0];

    if (isActive(leftSibling) && isActive(prevSelf) && isActive(rightSibling)) {
      setClass(target, processer[0]);
    } else if (isActive(leftSibling) && isActive(prevSelf) && !isActive(rightSibling)) {
      setClass(target, processer[1]);
    } else if (isActive(leftSibling) && !isActive(prevSelf) && isActive(rightSibling)) {
      setClass(target, processer[2]);
    } else if (isActive(leftSibling) && !isActive(prevSelf) && !isActive(rightSibling)) {
      setClass(target, processer[3]);
    } else if (!isActive(leftSibling) && isActive(prevSelf) && isActive(rightSibling)) {
      setClass(target, processer[4]);
    } else if (isActive(leftSibling) && !isActive(prevSelf) && isActive(rightSibling)) {
      setClass(target, processer[5]);
    } else if (!isActive(leftSibling) && !isActive(prevSelf) && isActive(rightSibling)) {
      setClass(target, processer[6]);
    } else if (!isActive(leftSibling) && !isActive(prevSelf) && !isActive(rightSibling)) {
      setClass(target, processer[7]);
    }
  }
}

function setClass(cell, isActive) {
  cell.classList = "";
  cell.classList.add(isActive ? 'active' : 'inactive');
}

function isActive(cell) {
  return cell.classList.contains('active');
}

function dublicateRow() {
  var rows = document.querySelectorAll('.row');
  var lastrow = rows[rows.length - 1];
  var clone = lastrow.cloneNode(true);
  randomizeRow(clone);
  processRow(clone, lastrow);
  box.appendChild(clone);
}

function tick(maxRow) {
  var countOfRows = document.querySelectorAll('.row').length;
  if (countOfRows > maxRow) return true;
  linesCounterDiv.innerHTML = countOfRows + ' lines';
  cellsCounterDiv.innerHTML = countOfRows * itemsCount + ' cells';
  dublicateRow();
}

function createFirstRow(row) {
  var _loop = function _loop(i) {
    var div = document.createElement('div');
    ['flex-basis', 'height'].map(function (property) {
      div.style[property] = calculateBlockSize();
    });
    row.appendChild(div);
  };

  for (var i = 0; i < itemsCount; i++) {
    _loop(i);
  }
}

createFirstRow(firstRowDiv);
randomizeRow(firstRowDiv);
var interval = setInterval(function (_) {
  if (tick(maxRow)) clearInterval(interval);
}, speed);