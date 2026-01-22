// ---------- Spielvariablen ----------
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

//NEU
const dialog = document.getElementById("dialog");
const dialogText = document.getElementById("dialog-text");
const answersDiv = document.getElementById("answers");
//NEU


const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const progressEl = document.getElementById('progress');

const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');

const tileSize = 50;
const gridSize = 10;

// Spielfigur
let player = { x: 0, y: 0 };

//NEU
let solvedCount = 0;
let dialogOpen = false;

// Objekte mit Positionen
const objects = [
    {x: 2, y: 3, solved: false, text: "Buchstabensalat: RGUBMHA ", answer: "Hamburg"},
    {x: 7, y: 1, solved: false, text: "Ich werde nass, wenn ich trockne - was bin ich?", answer: "Handtuch"},
    {x: 4, y: 8, solved: false, fading: false, question: "Welche der folgenden Eigenschaften beschreibt am besten einen typischen, trockenen Riesling aus Deutschland?",
                 answer: [["A: Schwere, buttrige Noten mit wenig Säure", "B: Leichte, knackige Säure mit Aromen von grünen Äpfeln und Zitrusfrüchten", 
                           "C: Dunkle Beerenaromen und Tannine", "D: Süße Süßweinaromen und Rosinen"], correct: 2},
    {x: 9, y: 6, solved: false, text: "Buchstabensalat - LSENLEWS", answer: "Wellness"}
];

// Sounds
const moveSound = new Audio('sounds/move.wav');
const correctSound = new Audio('sounds/correct.wav');
const wrongSound = new Audio('sounds/wrong.mp3');

document.getElementById("start-btn").onclick = () => {
    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    draw();
};

document.getElementById("restart-btn").onclick = () => location.reload();

// ---------- Steuerung ----------
document.addEventListener("keydown", e => {
    if (dialogOpen) return;

    const moves = {
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0]
    };

    if (moves[e.key]) move(...moves[e.key]);
});

document.querySelectorAll("#touch-controls button").forEach(btn => {
    btn.onclick = () => {
        if (dialogOpen) return;
        const dir = btn.dataset.dir;
        move(
            dir === "left" ? -1 : dir === "right" ? 1 : 0,
            dir === "up" ? -1 : dir === "down" ? 1 : 0
        );
    };
});

// ---------- Spiellogik ----------
function move(dx, dy) {
    const nx = player.x + dx;
    const ny = player.y + dy;

    if (nx < 0 || ny < 0 || nx >= gridSize || ny >= gridSize) return;

    player.x = nx;
    player.y = ny;
    moveSound.play();
    draw();
    checkObject();
}

function checkObject() {
    const obj = objects.find(o => !o.solved && o.x === player.x && o.y === player.y);
    if (obj) openDialog(obj);
}

function openDialog(obj) {
    dialogOpen = true;
    dialog.classList.remove("hidden");
    dialogText.textContent = obj.question;
    answersDiv.innerHTML = "";

    obj.answers.forEach((answer, index) => {
        const btn = document.createElement("button");
        btn.textContent = answer;
        btn.onclick = () => checkAnswer(obj, index);
        answersDiv.appendChild(btn);
    });
}

function checkAnswer(obj, index) {
    if (index === obj.correct) {
        correctSound.play();
        obj.solved = true;
        obj.fading = true;
        solvedCount++;
        setTimeout(() => obj.fading = false, 600);
    } else {
        wrongSound.play();
    }

    closeDialog();
    draw();

    if (solvedCount === objects.length) {
        gameScreen.classList.add("hidden");
        endScreen.classList.remove("hidden");
    }
}

function closeDialog() {
    dialogOpen = false;
    dialog.classList.add("hidden");
}

// ---------- Rendering ----------
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Raster
    ctx.strokeStyle = "#ccc";
    for (let i = 0; i <= gridSize; i++) {
        ctx.beginPath();
        ctx.moveTo(i * tileSize, 0);
        ctx.lineTo(i * tileSize, gridSize * tileSize);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * tileSize);
        ctx.lineTo(gridSize * tileSize, i * tileSize);
        ctx.stroke();
    }

    // Objekte
    objects.forEach(o => {
        if (!o.solved || o.fading) {
            ctx.globalAlpha = o.fading ? 0.4 : 1;
            ctx.fillStyle = "orange";
            ctx.fillRect(o.x * tileSize, o.y * tileSize, tileSize, tileSize);
            ctx.globalAlpha = 1;
        }
    });

    // Spieler
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x * tileSize, player.y * tileSize, tileSize, tileSize);

    progressEl.textContent = `Rätsel ${solvedCount}/${objects.length} geschafft`;
}
