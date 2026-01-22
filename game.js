const images = {
    player: new Image(),
    object1: new Image(),
    object2: new Image(),
    object3: new Image(),
    object4: new Image(), 
};

images.player.src = "images/player.png";
images.object1.src = "images/object1.png";
images.object2.src = "images/object2.png";
images.object3.src = "images/object3.png";
images.object4.src = "images/object4.png";

let assetsLoaded = 0;
const totalAssets = Object.keys(images).length;

Object.values(images).forEach(img => {
    img.onload = () => {
        assetsLoaded++;
        if (assetsLoaded === totalAssets) draw();
    };
});


const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

const dialog = document.getElementById("dialog");
const dialogText = document.getElementById("dialog-text");
const answersDiv = document.getElementById("answers");
const progressEl = document.getElementById("progress");

const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");

const tileSize = 50;
const gridSize = 10;

let player = { x: 0, y: 0 };
let solvedCount = 0;
let dialogOpen = false;

// Sounds
const moveSound = new Audio("sounds/move.wav");
const correctSound = new Audio("sounds/correct.wav");
const wrongSound = new Audio("sounds/wrong.mp3");

// Rätsel-Objekte
const objects = [
    {
        x: 2, y: 2, image: images.object1, solved: false, fading: false,
        question: "Welches Tier quakt?",
        answers: ["Hund", "Ente", "Katze"],
        correct: 1
    },
    {
        x: 7, y: 1, image: images.object2, solved: false, fading: false,
        question: "Buchstabensalat: P A P E L",
        answers: ["Apfel", "Papel", "Lapep"],
        correct: 0
    },
    {
        x: 4, y: 8, image: images.object3, solved: false, fading: false,
        question: "5 + 3 = ?",
        answers: ["6", "7", "8"],
        correct: 2
    },
    {
        x: 9, y: 6, image: images.object4, solved: false, fading: false,
        question: "Welche Farbe hat der Himmel?",
        answers: ["Grün", "Blau", "Rot"],
        correct: 1
    }
];

// ---------- Start / Restart ----------
document.getElementById("start-btn").onclick = () => {
    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
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
            objects.forEach(o => {
    if (!o.solved || o.fading) {
        ctx.globalAlpha = o.fading ? 0.4 : 1;
        ctx.drawImage(
            o.image,
            o.x * tileSize,
            o.y * tileSize,
            tileSize,
            tileSize
        );
        ctx.globalAlpha = 1;
    }
});         
}
    }
                    };
    // Spieler
ctx.fillStyle = "blue";
ctx.fillRect(player.x * tileSize, player.y * tileSize, tileSize, tileSize);
ctx.drawImage(
    images.player,
    player.x * tileSize,
    player.y * tileSize,
    tileSize,
    tileSize
);


    progressEl.textContent = `Rätsel ${solvedCount}/${objects.length} geschafft`;
}
