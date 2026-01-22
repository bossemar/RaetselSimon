/* =========================
   Grundeinstellungen
========================= */

let gameStarted = false;

const TILE = 32;
const SIZE = 10;

let player = { x: 0, y: 0 };
let solvedCount = 0;
updateProgress();
let activeObject = null;

/* =========================
   Sounds
========================= */

const sounds = {
  move: new Audio("sounds/move.wav"),
  correct: new Audio("sounds/correct.wav"),
  wrong: new Audio("sounds/wrong.wav")
};

/* =========================
   Spielobjekte & Rätsel
========================= */

const objects = [
  { x: 2, y: 2, riddle: "LEWSESNL", solution: "Wellness", solved: false },
  { x: 7, y: 1, riddle: "Was wird nass beim Trocknen?", solution: "HANDTUCH", solved: false },
  { x: 4, y: 6, riddle: "BUCHSTABENSALAT: RGUBMHA", solution: "Hamburg", solved: false },
  { x: 8, y: 8, riddle: "Ich bin sehr alt, aber mich kann man trinken und ich schmecke lecker.", solution: "Wein", solved: false }
];

/* =========================
   DOM-Referenzen
========================= */

const game = document.getElementById("game");
const playerEl = document.getElementById("player");

/* =========================
   Objekte im Raum erzeugen
========================= */

objects.forEach((obj, index) => {
  const el = document.createElement("div");
  el.className = "object";
  el.id = "obj" + index;
  el.style.left = obj.x * TILE + "px";
  el.style.top = obj.y * TILE + "px";
  game.appendChild(el);
});

/* =========================
   Spieler-Rendering
========================= */

function updatePlayer() {
  playerEl.style.left = player.x * TILE + "px";
  playerEl.style.top = player.y * TILE + "px";
}

/* =========================
   Bewegung
========================= */

function move(dx, dy) {
  player.x = Math.max(0, Math.min(SIZE - 1, player.x + dx));
  player.y = Math.max(0, Math.min(SIZE - 1, player.y + dy));

  sounds.move.currentTime = 0;
  sounds.move.play();

  updatePlayer();
  checkForObject();
}

/* Tastatur */
document.addEventListener("keydown", e => {
   if (!gameStarted) return;
  if (document.getElementById("dialog").classList.contains("hidden") === false) return;

  if (e.key === "ArrowUp") move(0, -1);
  if (e.key === "ArrowDown") move(0, 1);
  if (e.key === "ArrowLeft") move(-1, 0);
  if (e.key === "ArrowRight") move(1, 0);
});

/* Touch-Buttons */
document.querySelectorAll("#controls button").forEach(btn => {
  btn.addEventListener("click", () => {
    const dir = btn.dataset.dir;
    if (dir === "up") move(0, -1);
    if (dir === "down") move(0, 1);
    if (dir === "left") move(-1, 0);
    if (dir === "right") move(1, 0);
  });
});

/* =========================
   Objekt-Interaktion
========================= */

function checkForObject() {
  const obj = objects.find(o =>
    o.x === player.x &&
    o.y === player.y &&
    !o.solved
  );

  if (obj) openDialog(obj);
}

/* =========================
   Dialog öffnen
========================= */

function openDialog(obj) {
  activeObject = obj;

  const dialog = document.getElementById("dialog");
  const text = document.getElementById("dialogText");
  const input = document.getElementById("answer");
  const feedback = document.getElementById("feedback");
  const submit = document.getElementById("submit");

  text.textContent = obj.riddle;
  input.value = "";
  feedback.textContent = "";

  dialog.classList.remove("hidden");

  setTimeout(() => input.focus(), 100);

  submit.onclick = checkAnswer;
  input.onkeydown = e => {
    if (e.key === "Enter") checkAnswer();
  };
}

/* =========================
   Antwort prüfen
========================= */

function checkAnswer() {
  const input = document.getElementById("answer");
  const feedback = document.getElementById("feedback");

  const value = input.value.trim().toUpperCase();
  if (!value) return;

  if (value === activeObject.solution) {
    activeObject.solved = true;
    solvedCount++;

    sounds.correct.currentTime = 0;
    sounds.correct.play();

    feedback.textContent = "Richtig! Gut gemacht.";
    feedback.style.color = "green";

    const objEl = document.getElementById(
      "obj" + objects.indexOf(activeObject)
    );
    if (objEl) objEl.style.display = "none";

    updateProgress();

    setTimeout(() => {
      closeDialog();
      if (solvedCount === objects.length) endGame();
    }, 1200);

  } else {
    sounds.wrong.currentTime = 0;
    sounds.wrong.play();

    feedback.textContent = "Leider falsch. Versuch es nochmal.";
    feedback.style.color = "red";

    input.focus();
    input.select();
  }
}

/* =========================
   Dialog schließen
========================= */

function closeDialog() {
  document.getElementById("dialog").classList.add("hidden");
  document.getElementById("feedback").textContent = "";
  activeObject = null;
}

/* =========================
   Fortschritt & Ende
========================= */

function updateProgress() {
  document.getElementById("progress").textContent =
    `Gelöst: ${solvedCount} / ${objects.length}`;
}

function endGame() {
  document.getElementById("end").classList.remove("hidden");
}

/* =========================
   Initialisierung
========================= */

updatePlayer();
updateProgress();

const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");

startButton.addEventListener("click", () => {
  gameStarted = true;
  startScreen.style.display = "none";
   draw();
});
const restartButton = document.getElementById("restartButton");

restartButton.addEventListener("click", () => {
  solvedCount = 0;
  updateProgress();

  riddles.forEach(r => r.solved = false);

  player.x = 0;
  player.y = 0;

  document.getElementById("end").classList.add("hidden");

  gameStarted = false;
  startScreen.style.display = "flex";

  draw();
});

