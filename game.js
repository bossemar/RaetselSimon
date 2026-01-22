const player = document.getElementById("player");
const dialog = document.getElementById("dialog");
const riddleText = document.getElementById("riddle-text");
const answerInput = document.getElementById("answer");
const progressText = document.getElementById("progress");

const moveSound = new Audio("sounds/move.wav");
const correctSound = new Audio("sounds/correct.wav");
const wrongSound = new Audio("sounds/wrong.mp3");

let x = 250;
let y = 250;
let solved = [false, false, false, false];
let currentRiddle = null;

const riddles = [
    { text: "Ich werde nass, wenn ich trockne - was bin ich?", solution: "Handtuch" },
    { text: "Buchstabensalat: RGUBMHA ", solution: "Hamburg" },
    { text: "Ich bin alt, aber mich kann man trinken – was bin ich?", solution: "" },
    { text: "Buchstabensalat - LSENLEWS", solution: "Wellness" }
];

function move(direction) {
    moveSound.play();

    if (direction === "up" && y > 0) y -= 50;
    if (direction === "down" && y < 450) y += 50;
    if (direction === "left" && x > 0) x -= 50;
    if (direction === "right" && x < 450) x += 50;

    player.style.top = y + "px";
    player.style.left = x + "px";

    checkCollision();
}

document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp") move("up");
    if (e.key === "ArrowDown") move("down");
    if (e.key === "ArrowLeft") move("left");
    if (e.key === "ArrowRight") move("right");
});

function checkCollision() {
    document.querySelectorAll(".object").forEach(obj => {
        if (
            obj.offsetTop === y &&
            obj.offsetLeft === x
        ) {
            openDialog(obj.dataset.id);
        }
    });
}

function openDialog(id) {
    if (solved[id]) return;
    currentRiddle = id;
    riddleText.textContent = riddles[id].text;
    dialog.classList.remove("hidden");
}

function closeDialog() {
    dialog.classList.add("hidden");
    answerInput.value = "";
}

function checkAnswer() {
    const userAnswer = answerInput.value.toLowerCase().trim();

    if (userAnswer === riddles[currentRiddle].solution) {
        correctSound.play();
        solved[currentRiddle] = true;
        updateProgress();
        closeDialog();
    } else {
        wrongSound.play();
        alert("Falsch!");
    }
}

function updateProgress() {
    const count = solved.filter(s => s).length;
    progressText.textContent = `Fortschritt: ${count} / 4`;
}

function restartGame() {
    x = 250;
    y = 250;
    solved = [false, false, false, false];
    updateProgress();
    player.style.top = y + "px";
    player.style.left = x + "px";
}
