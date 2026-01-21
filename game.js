const TILE = 32;
const SIZE = 10;

let player = { x: 0, y: 0 };
let solvedCount = 0;

const sounds = {
  move: new Audio("sounds/move.wav"),
  correct: new Audio("sounds/correct.wav"),
  wrong: new Audio("sounds/wrong.mp3")
};

const objects = [
  { x: 2, y: 2, riddle: "senlleWs", solution: "Wellness", solved: false },
  { x: 7, y: 1, riddle: "Was wird nass beim Trocknen?", solution: "Handtuch", solved: false },
  { x: 4, y: 6, riddle: "BUCHSTABENSALAT: GRBUMAH", solution: "Hamburg", solved: false },
  { x: 8, y: 8, riddle: "Mich kannst du trinken, ich bin aber sehr alt.", solution: "Wein", solved: false }
];

const game = document.getElementById("game");
const playerEl = document.getElementById("player");

/* Objekte rendern */
objects.forEach((o, i) => {
  const el = document.createElement("div");
  el.className = "object";
  el.style.left = o.x * TILE + "px";
  el.style.top = o.y * TILE + "px";
  el.id = "obj" + i;
  game.appendChild(el);
});

function updatePlayer() {
  playerEl.style.left = player.x * TILE + "px";
  playerEl.style.top = player.y * TILE + "px";
}

function move(dx, dy) {
  player.x = Math.max(0, Math.min(SIZE - 1, player.x + dx));
  player.y = Math.max(0, Math.min(SIZE - 1, player.y + dy));
  sounds.move.play();
  updatePlayer();
  checkObject();
}

/* Tastatur */
document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") move(0, -1);
  if (e.key === "ArrowDown") move(0, 1);
  if (e.key === "ArrowLeft") move(-1, 0);
  if (e.key === "ArrowRight") move(1, 0);
});

/* Touch */
document.querySelectorAll("#controls button").forEach(btn => {
  btn.onclick = () => {
    const d = btn.dataset.dir;
    if (d === "up") move(0, -1);
    if (d === "down") move(0, 1);
    if (d === "left") move(-1, 0);
    if (d === "right") move(1, 0);
  };
});

function checkObject() {
  const obj = objects.find(o => o.x === player.x && o.y === player.y && !o.solved);
  if (obj) openDialog(obj);
}

function openDialog(obj) {
  document.getElementById("dialog").classList.remove("hidden");
  document.getElementById("dialogText").textContent = obj.riddle;

  document.getElementById("submit").onclick = () => {
    const val = document.getElementById("answer").value.toUpperCase();
    if (val === obj.solution) {
      obj.solved = true;
      solvedCount++;
      sounds.correct.play();
      document.getElementById("obj" + objects.indexOf(obj)).style.display = "none";
      updateProgress();
      closeDialog();
      if (solvedCount === objects.length) endGame();
    } else {
      sounds.wrong.play();
      alert("Leider falsch.");
    }
  };
}

function closeDialog() {
  document.getElementById("dialog").classList.add("hidden");
  document.getElementById("answer").value = "";
}

function updateProgress() {
  document.getElementById("progress").textContent =
    `Gelöst: ${solvedCount} / ${objects.length}`;
}

function endGame() {
  document.getElementById("end").classList.remove("hidden");
}

updatePlayer();
updateProgress();
