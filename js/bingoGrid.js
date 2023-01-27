const container = document.getElementById('bingoContainer');
let bingoRows = [5];
let bingoGrid = [5];
for (let i = 0; i < 5; i++) { bingoRows[i] = false; }
for (let i = 0; i < 5; i++) { bingoGrid[i] = bingoRows; }
let debug = false;


const handleCell = function (cell) {
    let cellId = cell.target.id;

    let row = Math.floor(cellId/5);
    let col = cellId%5;
    if (debug) console.log("row: " + row + " col: " + col);
    bingoGrid[row][col] = true;

    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if (debug) console.log(bingoGrid[i][j]);
            if (bingoGrid[i][j] === true) {
                if (cell.target.className !== 'bingoCellSelected') {
                    cell.target.classList.add('bingoCellSelected');
                }
            }
        }
    }
}

container.addEventListener('click', handleCell);

function generateGrid() {
    let size = 5
    const genGrid = [size];
    const genRows = [size];
    for (let i = 0; i < size; i++) {
        genGrid[i] = [size];
        genRows[i] = document.createElement('div');
        genRows[i].className = 'bingoRow';
        for (let j = 0; j < size; j++) {
            genGrid[i][j] = document.createElement('div');
            genGrid[i][j].className = 'bingoCell';
            genGrid[i][j].id = 5*i + j;
            genGrid[i][j].innerHTML = 5*i + j;
            genRows[i].appendChild(genGrid[i][j]);
        }
        container.appendChild(genRows[i]);
    }

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            bingoGrid[i][j] = false;
        }
    }
}

window.onload = function () {
    generateGrid();
}