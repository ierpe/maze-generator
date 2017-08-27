'use strict';

const { GRID_SIZE, CELL_COUNT } = require('../constants');
const { getRandomCell, getUnvisitedNeighbour } = require('../cell/locators');
const { createCell } = require('../cell/factory');
const createStack = require('./stack');

const cellMarkers = new Map([
    [0, cell => cell.markAsStart()],
    [CELL_COUNT - 1, cell => cell.markAsFinish()],
]);

const createFilledArray = (length, predicate) => Array(length).fill(null).map(
    (_, i) => predicate(i)
);

function generateCells() {
    return createFilledArray(
        GRID_SIZE,
        column => createFilledArray(
            GRID_SIZE,
            row => createCell(column, row)
        )
    );
}

function markCell(cell, visitedCellsCount) {
    if (cellMarkers.has(visitedCellsCount)) {
        cellMarkers.get(visitedCellsCount)(cell);
    }
}

// TODO: Generate in Worker thread?
function generateMaze(
    cells = generateCells(),
    cell = getRandomCell(cells),
    stack = createStack(),
    visitedCellsCount = 0,
) {
    const neighbour = getUnvisitedNeighbour(cells, cell);
    const nextCell = neighbour || stack.pop();
    const increment = neighbour ? 1 : 0;

    markCell(cell, visitedCellsCount);

    if (neighbour) {
        neighbour.visit(cell); // TODO - progressively render maze by calling decoupled render function
        stack.push(neighbour);
    }

    return visitedCellsCount === CELL_COUNT - 1
        ? cells
        : generateMaze(cells, nextCell, stack, visitedCellsCount + increment);
}

module.exports = generateMaze;
