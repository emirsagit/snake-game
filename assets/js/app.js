const grid = document.querySelector(".grid");
const startBtn = document.getElementById("start");
const score = document.getElementById("score");
const initialTimeForApple = 2000;
const initialSpeed = 1000;
let squares = [];
let currentSnake = [2, 1, 0];
let direction = 1;
let snakeSpeed = initialSpeed;
let width = 10;
let totalDıv = 100;
let applePosition = "";
let intr;

function createSquares() {
  for (let i = 0; i < totalDıv; i++) {
    let square = document.createElement("div");
    grid.appendChild(square);
    squares.push(square);
  }
}

function createSnake() {
  currentSnake.forEach((snake) => {
    squares[snake].classList.add("snake");
  });
}

function createApple(appleFirstAppearenceTime, appleDisappearTime) {
  console.log(appleDisappearTime);

  setTimeout(() => {
    do {
      applePosition = Math.floor(Math.random() * totalDıv);
    } while (currentSnake.includes(applePosition));
    squares[applePosition].classList.add("apple");
  }, appleFirstAppearenceTime);

  setTimeout(() => {
    removeApple();
    appleFirstAppearenceTime = Math.floor(Math.random() * 10000);
    appleDisappearTime =
      snakeSpeed * Math.abs((currentSnake[0] - applePosition) % 10) * 3 +
      appleFirstAppearenceTime +
      3000;
    createApple(appleFirstAppearenceTime, appleDisappearTime);
  }, appleDisappearTime);
}

function removeApple() {
  squares[applePosition].classList.remove("apple");
}

function failed() {
  clearInterval(intr);
}

function removeSnake(lastItem) {
  squares[lastItem].classList.remove("snake");
  currentSnake.unshift(currentSnake[0] + direction);
}

function checkFailing() {
  const s = new Set(currentSnake);
  if (
    (currentSnake[0] % width === 0 && direction === 1) ||
    (currentSnake[0] % width === 9 && direction === -1) ||
    currentSnake[0] >= totalDıv ||
    currentSnake[0] < 0 ||
    currentSnake.length !== s.size
  ) {
    failed();
    return true;
  }
  return false;
}

function move() {
  const tail = currentSnake.pop();
  if (currentSnake[0] === applePosition) {
    removeApple();
    squares[tail].classList.add("snake");
    currentSnake.push(tail);
    snakeSpeed *= 0.8;
    clearInterval(intr);
    intr = setInterval(move, snakeSpeed);
    score.textContent = parseInt(score.textContent) + 10;
  }
  removeSnake(tail);

  if (!checkFailing(intr)) {
    createSnake();
  }
}

function start() {
  currentSnake.forEach((i) => {
    squares[i].classList.remove("snake");
  });
  currentSnake = [2, 1, 0];
  clearInterval(intr);
  applePosition ? removeApple() : "";
  direction = 1;
  snakeSpeed = initialSpeed;
  applePosition = "";
  intr = setInterval(move, snakeSpeed);
  let appleFirstAppearenceTime = initialTimeForApple;
  let appleDisappearTime = initialTimeForApple * 5;
  createApple(appleFirstAppearenceTime, appleDisappearTime);
}

function changeDirection(e) {
  switch (e.key) {
    case "ArrowUp":
      direction = -width;
      break;
    case "ArrowDown":
      direction = width;
      break;
    case "ArrowRight":
      direction = 1;
      break;
    case "ArrowLeft":
      direction = -1;
      break;
  }
}

startBtn.addEventListener("click", start);
document.addEventListener("keyup", changeDirection);
createSquares();
createSnake();
