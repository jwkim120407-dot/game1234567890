const difficulties = {
  'very-easy': { rows: 5, cols: 5, mines: 4 },
  easy: { rows: 10, cols: 10, mines: 15 },
  medium: { rows: 15, cols: 15, mines: 35 },
  hard: { rows: 20, cols: 20, mines: 60 },
};

const boardEl = document.getElementById('board');
const difficultySelect = document.getElementById('difficulty');
const resetBtn = document.getElementById('resetBtn');
const flagModeBtn = document.getElementById('flagModeBtn');
const minesLeftEl = document.getElementById('minesLeft');
const timerEl = document.getElementById('timer');
const statusEl = document.getElementById('status');

let state = {
  board: [],
  revealed: new Set(),
  flagged: new Set(),
  minePositions: new Set(),
  rows: 0,
  cols: 0,
  mines: 0,
  safeCells: 0,
  revealedSafe: 0,
  startTime: null,
  timerId: null,
  gameOver: false,
  flagMode: false,
};

function initGame() {
  const { rows, cols, mines } = difficulties[difficultySelect.value];
  const totalCells = rows * cols;
  if (mines >= totalCells) {
    throw new Error('지뢰의 수가 칸 수보다 많습니다.');
  }

  state = {
    ...state,
    rows,
    cols,
    mines,
    board: Array.from({ length: rows }, () => Array(cols).fill(0)),
    revealed: new Set(),
    flagged: new Set(),
    minePositions: new Set(),
    safeCells: totalCells - mines,
    revealedSafe: 0,
    startTime: null,
    gameOver: false,
  };

  placeMines();
  computeNumbers();
  renderBoard();
  updateMinesLeft();
  resetTimer();
  statusEl.textContent = '행운을 빕니다!';
  setFlagMode(false);
}

function coordToKey(r, c) {
  return `${r},${c}`;
}

function placeMines() {
  const { rows, cols, mines } = state;
  while (state.minePositions.size < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    state.minePositions.add(coordToKey(r, c));
  }
}

function computeNumbers() {
  const { board, minePositions, rows, cols } = state;
  minePositions.forEach((key) => {
    const [r, c] = key.split(',').map(Number);
    board[r][c] = 'M';
    getNeighbors(r, c).forEach(([nr, nc]) => {
      if (board[nr][nc] !== 'M') {
        board[nr][nc] += 1;
      }
    });
  });
}

function getNeighbors(r, c) {
  const { rows, cols } = state;
  const neighbors = [];
  for (let dr = -1; dr <= 1; dr += 1) {
    for (let dc = -1; dc <= 1; dc += 1) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        neighbors.push([nr, nc]);
      }
    }
  }
  return neighbors;
}

function renderBoard() {
  const { rows, cols } = state;
  boardEl.innerHTML = '';
  boardEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const cell = document.createElement('button');
      cell.className = 'cell';
      cell.setAttribute('data-row', r);
      cell.setAttribute('data-col', c);
      cell.setAttribute('aria-label', `r${r + 1} c${c + 1}`);
      cell.addEventListener('click', onCellClick);
      cell.addEventListener('contextmenu', onCellRightClick);
      boardEl.appendChild(cell);
    }
  }
}

function onCellClick(event) {
  const cell = event.currentTarget;
  if (state.gameOver) return;
  startTimer();

  const r = Number(cell.dataset.row);
  const c = Number(cell.dataset.col);
  const key = coordToKey(r, c);

  if (state.flagged.has(key) && !state.flagMode) return;
  if (state.flagMode) {
    toggleFlag(cell, key);
    return;
  }
  if (state.revealed.has(key)) return;

  if (state.board[r][c] === 'M') {
    revealMine(cell, r, c);
    endGame(false);
    return;
  }

  floodReveal(r, c);
  checkWin();
}

function onCellRightClick(event) {
  event.preventDefault();
  if (state.gameOver) return;
  startTimer();

  const cell = event.currentTarget;
  const r = Number(cell.dataset.row);
  const c = Number(cell.dataset.col);
  const key = coordToKey(r, c);

  if (state.revealed.has(key)) return;
  toggleFlag(cell, key);
}

function toggleFlag(cell, key) {
  if (state.flagged.has(key)) {
    state.flagged.delete(key);
    cell.classList.remove('flagged');
  } else if (state.flagged.size < state.mines) {
    state.flagged.add(key);
    cell.classList.add('flagged');
  }
  updateMinesLeft();
}

function revealMine(cell, r, c) {
  cell.classList.add('revealed', 'mine');
  cell.setAttribute('aria-label', `지뢰 (${r + 1}, ${c + 1})`);
  showAllMines();
}

function showAllMines() {
  const buttons = boardEl.querySelectorAll('.cell');
  buttons.forEach((cell) => {
    const r = Number(cell.dataset.row);
    const c = Number(cell.dataset.col);
    if (state.minePositions.has(coordToKey(r, c))) {
      cell.classList.add('revealed', 'mine');
    }
  });
}

function floodReveal(r, c) {
  const stack = [[r, c]];
  while (stack.length) {
    const [cr, cc] = stack.pop();
    const key = coordToKey(cr, cc);
    if (state.revealed.has(key)) continue;

    state.revealed.add(key);
    state.revealedSafe += 1;

    const cellEl = getCellElement(cr, cc);
    cellEl.classList.add('revealed');
    cellEl.classList.remove('flagged');

    const value = state.board[cr][cc];
    if (value > 0) {
      cellEl.dataset.value = value;
      cellEl.textContent = value;
    } else {
      cellEl.dataset.value = '';
    }

    if (value === 0) {
      getNeighbors(cr, cc).forEach(([nr, nc]) => {
        const neighborKey = coordToKey(nr, nc);
        if (!state.revealed.has(neighborKey)) {
          stack.push([nr, nc]);
        }
      });
    }
  }
}

function getCellElement(r, c) {
  return boardEl.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
}

function updateMinesLeft() {
  minesLeftEl.textContent = Math.max(
    state.mines - state.flagged.size,
    0
  ).toString();
}

function checkWin() {
  if (state.revealedSafe === state.safeCells) {
    endGame(true);
  }
}

function endGame(didWin) {
  state.gameOver = true;
  stopTimer();
  if (didWin) {
    statusEl.textContent = '승리! 모든 지뢰를 찾았습니다 🎉';
  } else {
    statusEl.textContent = '지뢰를 밟았습니다 💣 다시 도전해 보세요!';
  }
}

function startTimer() {
  if (state.startTime !== null) return;
  state.startTime = Date.now();
  state.timerId = setInterval(() => {
    const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
    timerEl.textContent = elapsed.toString().padStart(3, '0');
  }, 1000);
}

function stopTimer() {
  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
}

function resetTimer() {
  stopTimer();
  state.startTime = null;
  timerEl.textContent = '000';
}

function handleKeyboard(event) {
  if (event.code === 'Space') {
    event.preventDefault();
    initGame();
  }
}

function setFlagMode(enabled) {
  state.flagMode = enabled;
  flagModeBtn.setAttribute('aria-pressed', state.flagMode.toString());
  flagModeBtn.textContent = state.flagMode ? '깃발 모드 ON' : '깃발 모드 OFF';
}

resetBtn.addEventListener('click', initGame);
difficultySelect.addEventListener('change', initGame);
document.addEventListener('keydown', handleKeyboard);
flagModeBtn.addEventListener('click', () => setFlagMode(!state.flagMode));

initGame();

