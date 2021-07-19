const grid = document.querySelector(".grid");
const startBtn = document.getElementById("start");
const restartBtn = document.getElementById("restart");
const score = document.getElementById("score");
const finishScore = document.getElementById("finish-score");
const startDiv = document.querySelector(".start");
const finishDiv = document.querySelector(".finish");
const selectEls = document.querySelectorAll(".select");
const initialTimeForApple = 2000;
const noviceSpeed = 400;
const rookieSpeed = 250;
const masterSpeed = 130;
let initialSpeed = 400;
let squares = [];
let currentSnake = [2, 1, 0];
let direction = 1;
let snakeSpeed = initialSpeed; //130 250 400
let width = 14;
let totalDıv = 196;
let applePosition = 1;
let intrSnakeMoveId;
let intrAppleRemoveId;

/**
 * @param speed integer
 * Set snake speed
 */
function setSpeed(speed) {
  initialSpeed = speed;
  snakeSpeed = speed;
}

/**
 * @param e event
 * Set snake speed according to user select
 */
function changeInitialSpeed(e) {
  switch (e.target.value) {
    case "novice":
      setSpeed(noviceSpeed);
      break;
    case "rookie":
      setSpeed(rookieSpeed);
      break;
    case "master":
      setSpeed(masterSpeed);
      break;
  }
}

/**
 * Create main squeres dynamically
 */
function createSquares() {
  for (let i = 0; i < totalDıv; i++) {
    let square = document.createElement("div");
    grid.appendChild(square);
    squares.push(square);
  }
}

/**
 * Create snake dynamically
 */
function createSnake() {
  currentSnake.forEach((snake) => {
    squares[snake].classList.add("snake");
  });
}

/**
 * Create apple dynamically
 * Add apple randomly to the DOM
 * Remove apple from DOM after randomly but logically created time
 */
function createApple(appleDisappearTime) {
  if (!squares[applePosition].classList.contains("apple")) {
    do {
      applePosition = Math.floor(Math.random() * totalDıv);
    } while (currentSnake.includes(applePosition));
    squares[applePosition].classList.add("apple");
    appleDisappearTime =
      snakeSpeed *
      Math.abs(((currentSnake[0] - applePosition) % width) + 2) *
      7;
    if (!intrAppleRemoveId) {
      intrAppleRemoveId = setInterval(function () {
        removeApple();
      }, appleDisappearTime);
    }
  }
}

/**
 * @param el HTML element
 * Change display
 */
function toggleDisplay(el) {
  el.classList.toggle("display-none");
}

/**
 * @param value (master / rookie / novice)
 * Mark option selected according to the value
 */
function setSelectDefault(value) {
  for (let options of selectEls) {
    for (let option of options) {
      if (option.value === value) {
        option.setAttribute("selected", true);
      }
    }
  }
}

/**
 * Set selected attribute when failing
 * According to the user choice in a failed game
 */
function setDefault() {
  switch (initialSpeed) {
    case masterSpeed:
      setSelectDefault("master");
      break;
    case rookieSpeed:
      setSelectDefault("rookie");
      break;
    case noviceSpeed:
      setSelectDefault("novice");
      break;
  }
}

/**
 * Remove apple from DOM
 * As soon as apple remove create apple in another position
 */
function removeApple() {
  clearInterval(intrAppleRemoveId);
  intrAppleRemoveId = null;
  squares[applePosition].classList.remove("apple");
  createApple();
}

/**
 * Remove snake from dom
 */
function removeSnake(lastItem) {
  squares[lastItem].classList.remove("snake");
  currentSnake.unshift(currentSnake[0] + direction);
}

/**
 * Check snake hit the border or hit itself
 */
function checkFailing() {
  const s = new Set(currentSnake);
  if (
    (currentSnake[0] % width === 0 && direction === 1) ||
    (currentSnake[0] % width === width - 1 && direction === -1) ||
    currentSnake[0] >= totalDıv ||
    currentSnake[0] < 0 ||
    currentSnake.length !== s.size
  ) {
    failed();
    return true;
  }
  return false;
}

/**
 * When failed stop game, show score, show option for restarting
 */
function failed() {
  clearInterval(intrSnakeMoveId);
  clearInterval(intrAppleRemoveId);
  setDefault();
  finishScore.textContent = score.textContent;
  squares[applePosition].classList.remove("apple");
  toggleDisplay(finishDiv);
}

/**
 * @param tail (current tail of snake, int)
 * Remove apple
 * Grow snake
 * Increase speed
 * Increase score
 * Locate apple
 */
function snakeCaughtApple(tail) {
  removeApple();
  squares[tail].classList.add("snake");
  currentSnake.push(tail);
  snakeSpeed > initialSpeed / 2 ? (snakeSpeed *= 0.95) : "";
  clearInterval(intrSnakeMoveId);
  intrSnakeMoveId = setInterval(move, snakeSpeed);
  score.textContent = parseInt(score.textContent) + 10;
  createApple();
}

/**
 * Move the snake
 * Check the snake catchs apple
 */
function move() {
  const tail = currentSnake.pop();
  if (currentSnake[0] === applePosition) {
    snakeCaughtApple(tail);
  }
  removeSnake(tail);

  if (!checkFailing(intrSnakeMoveId)) {
    createSnake();
  }
}

/**
 * Set default
 * Start / Restart the game
 */
function start() {
  currentSnake.forEach((i) => {
    if (squares[i]) {
      squares[i].classList.remove("snake");
    }
  });
  currentSnake = [2, 1, 0];
  clearInterval(intrSnakeMoveId);
  createSnake();
  startDiv.classList.contains("display-none") ? "" : toggleDisplay(startDiv);
  finishDiv.classList.contains("display-none") ? "" : toggleDisplay(finishDiv);
  let appleDisappearTime = initialTimeForApple * 5;
  applePosition = 1;
  removeApple(appleDisappearTime);
  direction = 1;
  score.innerText = 0;
  snakeSpeed = initialSpeed;
  intrSnakeMoveId = setInterval(move, snakeSpeed);
}

/**
 * @param e is keyup event
 * Change snake direction
 */
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
restartBtn.addEventListener("click", start);
selectEls.forEach((element) => {
  element.addEventListener("change", changeInitialSpeed);
});
document.addEventListener("keyup", changeDirection);

createSquares();
createSnake();
setDefault();
