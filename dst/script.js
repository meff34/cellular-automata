'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var box = document.querySelector('#box');
var linesCounterDiv = document.querySelector('#lines');
var cellsCounterDiv = document.querySelector('#cells');
var navDiv = document.querySelector('#nav');
var automatoInterval = void 0;

var itemsCount = 250;
var speed = 120;
var maxRow = prompt('height', 100);

// automatos
// http://atlas.wolfram.com/01/01/
var processers = [[1, 0, 0, 0, 1, 0, 0, 1], [1, 1, 0, 1, 1, 0, 1, 0], [0, 0, 0, 1, 0, 1, 1, 0], [0, 1, 1, 0, 1, 1, 0, 1], [0, 1, 0, 0, 1, 0, 0, 1]];

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

function processRow(rowDiv, parentRowDiv, processer) {
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
  box.appendChild(clone);
  return [clone, lastrow];
}

function calculateElements() {
  var countOfRows = document.querySelectorAll('.row').length;
  linesCounterDiv.innerHTML = countOfRows + ' lines';
  cellsCounterDiv.innerHTML = countOfRows * itemsCount + ' cells';
}

function tick(maxRow, processer) {
  var _dublicateRow = dublicateRow();

  var _dublicateRow2 = _slicedToArray(_dublicateRow, 2);

  var clone = _dublicateRow2[0];
  var lastrow = _dublicateRow2[1];

  calculateElements();
  processRow(clone, lastrow, processer);
}

function fillFirstRow(row) {
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

function startAutomato(ruleset) {
  var firstRowDiv = document.createElement('div');
  firstRowDiv.classList.add('row');
  box.appendChild(firstRowDiv);
  fillFirstRow(firstRowDiv);
  randomizeRow(firstRowDiv);
  automatoInterval = setInterval(function () {
    var countOfRows = document.querySelectorAll('.row').length;
    if (countOfRows > maxRow) return clearInterval(automatoInterval);
    tick(maxRow, ruleset);
  }, speed);
}

function generateButtons() {
  processers.map(function (processer, i) {
    var button = document.createElement('button');
    button.innerHTML = 'rule #' + (i + 1);
    button.addEventListener('click', function () {
      stopAutomato();
      startAutomato(processer);
    });
    navDiv.appendChild(button);
  });
}

function stopAutomato() {
  clearInterval(automatoInterval);
  box.innerHTML = '';
}

generateButtons();
startAutomato(processers[0]);