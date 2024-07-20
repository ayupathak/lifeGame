const cols = 30;
const rows = 30;
let grid = createGrid(rows, cols);
let running = false;
let interval;

document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid-container');
    createGridElements(gridContainer, rows, cols);
    attachEventListeners();
    drawGrid();
    setupModal();
    drawDefaultPattern();
});

function createGrid(rows, cols) {
    return new Array(rows).fill(null).map(() => new Array(cols).fill(0));
}

function createGridElements(container, rows, cols) {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.x = x;
            cell.dataset.y = y;
            cell.addEventListener('click', () => toggleCell(x, y));
            container.appendChild(cell);
        }
    }
}

function attachEventListeners() {
    document.getElementById('start-stop').addEventListener('click', () => {
        if (!running && !isGridSetUp()) {
            alert("Please set up the grid before starting the simulation.");
            return;
        }

        running = !running;
        document.getElementById('start-stop').textContent = running ? 'Stop' : 'Start';
        
        if (running) {
            document.getElementById('controls').querySelectorAll('.btn').forEach(button => {
                if (button.id !== 'start-stop') {
                    button.style.display = 'none';
                }
            });
            interval = setInterval(() => {
                grid = updateGrid(grid);
                drawGrid();
            }, 100);
        } else {
            clearInterval(interval);
            grid = createGrid(rows, cols);
            drawGrid();
            document.getElementById('controls').querySelectorAll('.btn').forEach(button => {
                button.style.display = 'inline-block';
            });
        }
    });

    document.getElementById('randomize').addEventListener('click', () => {
        randomizeGrid();
        drawGrid();
    });

    document.getElementById('clear').addEventListener('click', () => {
        grid = createGrid(rows, cols);
        drawGrid();
    });

    document.getElementById('show-instructions').addEventListener('click', () => {
        document.getElementById('instructions-modal').style.display = 'block';
    });
}

function toggleCell(x, y) {
    grid[y][x] = grid[y][x] ? 0 : 1;
    drawGrid();
}

function drawGrid() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const x = cell.dataset.x;
        const y = cell.dataset.y;
        cell.classList.toggle('alive', grid[y][x] === 1);
    });
}

function getNeighbors(grid, y, x) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],          [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];
    return directions.reduce((acc, [dy, dx]) => {
        const newY = y + dy;
        const newX = x + dx;
        if (newY >= 0 && newY < rows && newX >= 0 && newX < cols) {
            acc += grid[newY][newX];
        }
        return acc;
    }, 0);
}

function updateGrid(grid) {
    return grid.map((row, y) => row.map((cell, x) => {
        const neighbors = getNeighbors(grid, y, x);
        if (cell === 1 && (neighbors < 2 || neighbors > 3)) return 0;
        if (cell === 0 && neighbors === 3) return 1;
        return cell;
    }));
}

function randomizeGrid() {
    grid = grid.map(row => row.map(() => Math.random() > 0.5 ? 1 : 0));
}

function drawDefaultPattern() {
    // Define a simple pattern, e.g., a "G" shape
    const pattern = [
        [5, 5], [5, 6], [5, 7], [6, 5], [7, 5], [7, 7], [8, 7], [8, 6]
    ];

    pattern.forEach(([y, x]) => {
        grid[y][x] = 1;
    });
    drawGrid();
}

function isGridSetUp() {
    return grid.some(row => row.some(cell => cell === 1));
}

function setupModal() {
    const modal = document.getElementById('instructions-modal');
    const span = document.getElementsByClassName('close')[0];

    span.onclick = () => {
        modal.style.display = 'none';
    }

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}
