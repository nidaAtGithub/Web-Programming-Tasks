// ===================== HUD / SCORE =====================
let score = 0;
const scoreElement = document.getElementById("score");

let hitStatus = 0;
const hitStatusElement = document.getElementById("hitStatus");

let missStatus = 0;
const missStatusElement = document.getElementById("missStatus");

// ===================== GAME STATE =====================
let shootLock = false;
let arrowTimer = null;
let targetTimer = null;

let isPaused = false;

// 1-minute timer
let gameCountdownTimer = null;
let remainingSeconds = 60;

// (optional) if you add <span id="timer">60</span> in HTML, it will show timer
const timerElement = document.getElementById("timer") || null;

// arrow position for resume
let arrowXState = 0;

function startGame() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameScreen").style.display = "block";

  const gameArea = document.querySelector(".game-area");
  const target = document.querySelector(".target-shape");
  const bow = document.querySelector(".bow");

  const stopBtn = document.querySelector(".stop-button");
  const playBtn = document.querySelector(".play-button");
  const restartBtn = document.querySelector(".restart-button");

  // reset pause lock
  isPaused = false;
  shootLock = false;

  // ---------- ARROW TEMPLATE ----------
  const arrowTemplate = document.querySelector(".arrow");
  arrowTemplate.style.display = "none"; // template hidden

  let arrow = null;
  let arrowHead = null;

  function makeNewArrow() {
    const newArrow = arrowTemplate.cloneNode(true);
    newArrow.style.display = "none";
    newArrow.style.position = "absolute";
    newArrow.style.left = "0px";
    newArrow.style.top = "0px";
    newArrow.style.transform = "none";
    gameArea.appendChild(newArrow);

    arrow = newArrow;
    arrowHead = arrow.querySelector(".arrow-head");
  }

  // ---------- CLEANUP + GO HOME ----------
  function clearAllTimers() {
    if (arrowTimer) {
      clearInterval(arrowTimer);
      arrowTimer = null;
    }
    if (targetTimer) {
      clearInterval(targetTimer);
      targetTimer = null;
    }
    if (gameCountdownTimer) {
      clearInterval(gameCountdownTimer);
      gameCountdownTimer = null;
    }
  }

  function resetHUD() {
    score = 0;
    hitStatus = 0;
    missStatus = 0;
    scoreElement.textContent = "0";
    hitStatusElement.textContent = "0";
    missStatusElement.textContent = "0";
  }

  function removeAllArrowsExceptTemplate() {
    document.querySelectorAll(".arrow").forEach((a) => {
      if (a !== arrowTemplate) a.remove();
    });
    arrow = null;
    arrowHead = null;
  }

  function goToStartScreen() {
    document.getElementById("gameScreen").style.display = "none";
    document.getElementById("startScreen").style.display = "flex";
  }

  // end game (used by Restart + timer end)
  function endGameToHome() {
    isPaused = false;
    shootLock = false;

    clearAllTimers();
    removeAllArrowsExceptTemplate();
    resetHUD();

    // reset target visual state
    target.style.transition = "none";
    target.style.top = "100px";
    // force reflow so transition works next time
    target.offsetHeight;
    target.style.transition = "top 1s linear";

    // reset countdown display
    remainingSeconds = 60;
    if (timerElement) timerElement.textContent = String(remainingSeconds);

    goToStartScreen();
  }

  // ---------- 1 MINUTE COUNTDOWN ----------
  function startCountdown() {
    if (gameCountdownTimer) clearInterval(gameCountdownTimer);

    remainingSeconds = 60;
    if (timerElement) timerElement.textContent = String(remainingSeconds);

    gameCountdownTimer = setInterval(() => {
      if (isPaused) return;

      remainingSeconds -= 1;
      if (timerElement) timerElement.textContent = String(remainingSeconds);

      if (remainingSeconds <= 0) {
        endGameToHome();
      }
    }, 1000);
  }

  // ---------- TARGET MOVEMENT ----------
  const minTop = 100;
  const maxBottom = 780;

  target.style.transition = "top 1s linear";

  function moveTargetOnce() {
    const targetHeight = target.offsetHeight || 120;
    const maxTop = maxBottom - targetHeight;
    const newTop = Math.floor(Math.random() * (maxTop - minTop + 1)) + minTop;
    target.style.top = newTop + "px";
  }

  function startTargetTimer() {
    if (targetTimer) clearInterval(targetTimer);
    moveTargetOnce();
    targetTimer = setInterval(moveTargetOnce, 1000);
  }

  startTargetTimer();
  startCountdown();

  // ---------- BOW DRAG ----------
  let draggingBow = false;
  const bowMinTop = 100;

  function bowMaxTop() {
    return gameArea.clientHeight - bow.offsetHeight;
  }

  bow.onmousedown = (e) => {
    if (isPaused) return;
    draggingBow = true;
    e.preventDefault();
  };

  window.onmouseup = () => {
    draggingBow = false;
  };

  window.onmousemove = (e) => {
    if (isPaused) return;
    if (!draggingBow) return;

    const rect = gameArea.getBoundingClientRect();
    const y = e.clientY - rect.top;

    let newTop = y - bow.offsetHeight / 2;
    newTop = Math.max(bowMinTop, Math.min(newTop, bowMaxTop()));

    bow.style.top = newTop + "px";
  };

  // ---------- ARROW LOOP ----------
  const arrowIntervalMs = 20;
  const arrowPixelsPerTick = 18;

  function stopArrowTimer() {
    if (arrowTimer) {
      clearInterval(arrowTimer);
      arrowTimer = null;
    }
  }

  function resetMissedArrow() {
    if (!arrow) return;
    arrow.remove();
    arrow = null;
    arrowHead = null;
    shootLock = false;
  }

  function stickArrowToTarget() {
    const tRect = target.getBoundingClientRect();
    const aRect = arrow.getBoundingClientRect();

    const offsetLeft = aRect.left - tRect.left;
    const offsetTop = aRect.top - tRect.top;

    target.appendChild(arrow);
    arrow.style.position = "absolute";
    arrow.style.left = offsetLeft + "px";
    arrow.style.top = offsetTop + "px";
    arrow.style.right = "auto";
    arrow.style.bottom = "auto";
    arrow.style.transform = "none";
  }

  function startArrowInterval() {
    stopArrowTimer();

    arrowTimer = setInterval(() => {
      if (isPaused) return;
      if (!arrow) return;

      arrowXState += arrowPixelsPerTick;
      arrow.style.left = arrowXState + "px";

      const arrowRect = arrow.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      const hit =
        arrowRect.right >= targetRect.left &&
        arrowRect.left <= targetRect.right &&
        arrowRect.bottom >= targetRect.top &&
        arrowRect.top <= targetRect.bottom;

      if (hit) {
        stopArrowTimer();

        stickArrowToTarget();

        score += 10;
        scoreElement.textContent = score;

        hitStatus += 1;
        hitStatusElement.textContent = hitStatus;

        shootLock = false;
        return;
      }

      const gameRight = gameArea.getBoundingClientRect().right;
      if (arrowRect.left > gameRight) {
        stopArrowTimer();

        missStatus += 1;
        missStatusElement.textContent = missStatus;

        resetMissedArrow();
      }
    }, arrowIntervalMs);
  }

  // ---------- SHOOT ----------
  function shootArrow() {
    if (isPaused) return;
    if (draggingBow) return;
    if (shootLock) return;

    if (!arrow || arrow.parentElement !== gameArea) {
      makeNewArrow();
    }

    shootLock = true;

    const bowRect = bow.getBoundingClientRect();
    const gameRect = gameArea.getBoundingClientRect();

    const startX = bowRect.right - gameRect.left;
    const startY = bowRect.top + bowRect.height / 2 - gameRect.top;

    arrow.style.display = "block";
    arrow.style.position = "absolute";
    arrow.style.transform = "none";

    arrowXState = startX;
    arrow.style.left = arrowXState + "px";
    arrow.style.top = (startY - arrow.offsetHeight / 2) + "px";

    startArrowInterval();
  }

  bow.onclick = shootArrow;

  // ---------- STOP / PLAY ----------
  function pauseGame() {
    if (isPaused) return;
    isPaused = true;

    // freeze target exactly where it is now (even mid-transition)
    const currentTop = window.getComputedStyle(target).top;
    target.style.transition = "none";
    target.style.top = currentTop;

    // stop target timer (arrow timer stays, but interval checks isPaused)
    if (targetTimer) {
      clearInterval(targetTimer);
      targetTimer = null;
    }

    // block new shots while paused
    shootLock = true;
  }

  function resumeGame() {
    if (!isPaused) return;
    isPaused = false;

    // restore target animation + restart timer
    target.style.transition = "top 1s linear";
    startTargetTimer();

    // if an arrow is currently in-flight, keep shootLock true until it ends/hits
    const arrowInFlight =
      arrow && arrow.parentElement === gameArea && arrow.style.display !== "none";

    shootLock = arrowInFlight ? true : false;
  }

  stopBtn.onclick = pauseGame;
  playBtn.onclick = resumeGame;

  // ---------- RESTART -> GO HOME ----------
  restartBtn.onclick = endGameToHome;
}

// ---------- Optional helpers ----------
function updateHitStatus(hit) {
  hitStatus = hit;
  hitStatusElement.textContent = hitStatus;
}

function updateMissStatus(mi) {
  missStatus = mi;
  missStatusElement.textContent = missStatus;
}

function updateScore(points) {
  score += points;
  scoreElement.textContent = score;
}
