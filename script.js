// DIFFICULTY_LEVELS object to store the configuration for each difficulty level.
const DIFFICULTY_LEVELS = {
    BEGINNER: { rows: 9, cols: 9, mines: 10 },
    INTERMEDIATE: { rows: 16, cols: 16, mines: 40 },
    EXPERT: { rows: 16, cols: 30, mines: 99 }
};

// Game state
let gameState = {
    board: [],
    mines: [],
    revealed: [],
    flagged: [],
    gameOver: false,
    gameStarted: false,
    difficulty: null,
    timer: 0,
    intervalId: null,
    flagMode: false
};

// Initialize the game
function initGame() {
    // Get DOM elements
    const beginnerButton = document.querySelector('.diff-buttons:nth-child(1)');
    const intermediateButton = document.querySelector('.diff-buttons:nth-child(2)');
    const expertButton = document.querySelector('.diff-buttons:nth-child(3)');
    const board = document.getElementById('board');
    const resetButton = document.getElementById('reset-button');
    const flagButton = document.getElementById('flag-button');
    const minesCount = document.getElementById('mines-count');
    const timer = document.getElementById('timer');

    // Add event listeners for difficulty buttons
    beginnerButton.addEventListener('click', () => startGame('BEGINNER'));
    intermediateButton.addEventListener('click', () => startGame('INTERMEDIATE'));
    expertButton.addEventListener('click', () => startGame('EXPERT'));
    resetButton.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        console.log('Reset button clicked/tapped');
        resetGame();
    });
    flagButton.addEventListener('click', toggleFlagMode);

    // Start with Beginner difficulty by default
    startGame('BEGINNER');

    function startGame(difficulty) {
        gameState.difficulty = difficulty;
        gameState.gameOver = false;
        gameState.gameStarted = false;
        gameState.board = [];
        gameState.mines = [];
        gameState.revealed = [];
        gameState.flagged = [];
        gameState.timer = 0;
        gameState.flagMode = false;
        timer.textContent = '000';
        resetButton.textContent = '😊';
        if (gameState.intervalId) clearInterval(gameState.intervalId);

        const config = DIFFICULTY_LEVELS[difficulty];
        minesCount.textContent = config.mines.toString().padStart(3, '0');
        
        // Set status bar width to match board
        const statusBar = document.getElementById('status-bar');
        const boardWidth = (config.cols * 31) + 11;
        statusBar.style.width = `${boardWidth}px`;
        
        // Clear game message
        const gameMessage = document.getElementById('game-message');
        gameMessage.textContent = '';
        gameMessage.classList.remove('show');
        
        // Ensure reset button is enabled
        resetButton.disabled = false;
        
        generateBoard(config.rows, config.cols, config.mines);
        renderBoard();
    }
}

function generateBoard(rows, cols, mines) {
    gameState.board = Array(rows * cols).fill().map(() => ({
        hasMine: false,
        adjacentMines: 0,
        revealed: false,
        flagged: false
    }));

    let minesPlaced = 0;
    while (minesPlaced < mines) {
        const index = Math.floor(Math.random() * rows * cols);
        if (!gameState.board[index].hasMine) {
            gameState.board[index].hasMine = true;
            gameState.mines.push(index);
            minesPlaced++;
        }
    }

    for (let i = 0; i < rows * cols; i++) {
        if (gameState.board[i].hasMine) continue;
        const row = Math.floor(i / cols);
        const col = i % cols;
        const neighbors = getNeighbors(row, col, rows, cols);
        gameState.board[i].adjacentMines = neighbors.filter(n => gameState.board[n].hasMine).length;
    }
}

function getNeighbors(row, col, rows, cols) {
    const neighbors = [];
    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
            if (r >= 0 && r < rows && c >= 0 && c < cols && !(r === row && c === col)) {
                neighbors.push(r * cols + c);
            }
        }
    }
    return neighbors;
}

function renderBoard() {
    const board = document.getElementById('board');
    const config = DIFFICULTY_LEVELS[gameState.difficulty];
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${config.cols}, 30px)`;
    board.style.gridTemplateRows = `repeat(${config.rows}, 30px)`;

    for (let i = 0; i < config.rows * config.cols; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;

        if (gameState.board[i].revealed) {
            cell.classList.add('revealed');
            if (gameState.board[i].hasMine) {
                cell.textContent = '💣';
            } else if (gameState.board[i].adjacentMines > 0) {
                cell.textContent = gameState.board[i].adjacentMines;
                cell.classList.add(`num-${gameState.board[i].adjacentMines}`);
            }
        } else if (gameState.board[i].flagged) {
            cell.textContent = '🚩';
        }

        cell.addEventListener('click', handleCellClick);
        cell.addEventListener('contextmenu', handleRightClick);
        board.appendChild(cell);
    }
}

function handleCellClick(event) {
    if (gameState.gameOver) return;
    const index = parseInt(event.target.dataset.index);
    if (gameState.board[index].revealed || (gameState.flagMode && gameState.board[index].flagged)) return;

    if (!gameState.gameStarted) {
        gameState.gameStarted = true;
        gameState.intervalId = setInterval(() => {
            gameState.timer++;
            document.getElementById('timer').textContent = gameState.timer.toString().padStart(3, '0');
        }, 1000);
    }

    if (gameState.flagMode) {
        toggleFlag(index);
    } else {
        revealCell(index);
    }
    renderBoard();
    checkWinCondition();
}

function handleRightClick(event) {
    event.preventDefault();
    if (gameState.gameOver) return;
    const index = parseInt(event.target.dataset.index);
    if (gameState.board[index].revealed) return;
    toggleFlag(index);
    renderBoard();
    checkWinCondition();
}

function toggleFlag(index) {
    if (!gameState.board[index].flagged) {
        gameState.board[index].flagged = true;
        gameState.flagged.push(index);
    } else {
        gameState.board[index].flagged = false;
        gameState.flagged = gameState.flagged.filter(i => i !== index);
    }
    updateMinesCount();
}

function updateMinesCount() {
    const config = DIFFICULTY_LEVELS[gameState.difficulty];
    const remainingMines = config.mines - gameState.flagged.length;
    document.getElementById('mines-count').textContent = remainingMines.toString().padStart(3, '0');
}

function revealCell(index) {
    const config = DIFFICULTY_LEVELS[gameState.difficulty];
    const row = Math.floor(index / config.cols);
    const col = index % config.cols;

    if (gameState.board[index].revealed || gameState.board[index].flagged) return;

    gameState.board[index].revealed = true;
    gameState.revealed.push(index);

    if (gameState.board[index].hasMine) {
        gameOver(false);
        return;
    }

    if (gameState.board[index].adjacentMines === 0) {
        const neighbors = getNeighbors(row, col, config.rows, config.cols);
        neighbors.forEach(n => revealCell(n));
    }
}

function gameOver(won) {
    gameState.gameOver = true;
    clearInterval(gameState.intervalId);
    document.getElementById('reset-button').textContent = won ? '😎' : '😢';
    if (!won) {
        gameState.mines.forEach(index => {
            gameState.board[index].revealed = true;
        });
    }
    const gameMessage = document.getElementById('game-message');
    gameMessage.textContent = won ? 'Congratulations! You won!' : 'Game Over! You hit a mine!';
    gameMessage.classList.add('show');
    renderBoard();
}

function checkWinCondition() {
    const config = DIFFICULTY_LEVELS[gameState.difficulty];
    const totalCells = config.rows * config.cols;
    const nonMineCells = totalCells - config.mines;

    if (gameState.revealed.length === nonMineCells) {
        gameOver(true);
    }
}

function toggleFlagMode() {
    gameState.flagMode = !gameState.flagMode;
    document.getElementById('flag-button').textContent = gameState.flagMode ? '🔲' : '🚩';
}

function resetGame() {
    console.log('resetGame called, difficulty:', gameState.difficulty);
    if (gameState.difficulty) {
        startGame(gameState.difficulty);
    }
}

document.addEventListener('DOMContentLoaded', initGame);