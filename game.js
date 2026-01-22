// =======================
// Variablen & DOM-Elemente
// =======================
const player = document.getElementById("player");
const dialog = document.getElementById("dialog");
const speech = document.querySelector(".speechbubble");
const progressText = document.getElementById("progress");
// Variablen für Screens
const startScreen = document.getElementById("start-screen");
const endScreen = document.getElementById("end-screen");

// Sounds
const moveSound = new Audio("sounds/move.wav");
const correctSound = new Audio("sounds/correct.wav");
const wrongSound = new Audio("sounds/wrong.mp3");

// Spielfigur-Position
let x = 250;
let y = 250;

// Fortschritt
let solved = [];
let currentRiddle = null;

// =======================
// Rätseldefinition
// =======================
const riddles = [
    {
        type: "text",
        text: "Ich bin ein Obst und rot – was bin ich?",
        solution: ["apfel"]
    },
    {
        type: "text",
        text: "Buchstabensalat: T A C H S – welches Wort entsteht?",
        solution: ["acht"]
    },
    {
        type: "text",
        text: "Ich habe Schlüssel, aber keine Türen – was bin ich?",
        solution: ["klavier"]
    },
    {
        type: "multiple",
        text: "Welche Farbe hat der Himmel an einem sonnigen Tag?",
        options: ["grün", "blau", "rot", "gelb"],
        solution: ["blau"]
    }
];

// =======================
// Initialisierung
// =======================
function initGame() {
    solved = new Array(riddles.length).fill(false);
    updateProgress();
    closeDialog();
}

initGame();

// =======================
// Spielfigur bewegen
// =======================
function move(direction) {
    if (!moveSound.paused) moveSound.currentTime = 0;
    moveSound.play();

    if (direction === "up" && y > 0) y -= 50;
    if (direction === "down" && y < 450) y += 50;
    if (direction === "left" && x > 0) x -= 50;
    if (direction === "right" && x < 450) x += 50;

    player.style.top = y + "px";
    player.style.left = x + "px";

    checkCollision();
}

// Pfeiltasten
document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp") move("up");
    if (e.key === "ArrowDown") move("down");
    if (e.key === "ArrowLeft") move("left");
    if (e.key === "ArrowRight") move("right");
});

// Touch-Buttons
window.move = move; // für HTML onclick

// =======================
// Kollision mit Objekten
// =======================
function checkCollision() {
    document.querySelectorAll(".object").forEach(obj => {
        if (obj.offsetTop === y && obj.offsetLeft === x && !solved[obj.dataset.id]) {
            openDialog(obj.dataset.id);
        }
    });
}

// =======================
// Dialog öffnen
// =======================
function openDialog(id) {
    if (solved[id]) return;

    currentRiddle = id;
    const r = riddles[id];

    speech.innerHTML = "";

    // Text
    const p = document.createElement("p");
    p.textContent = r.text;
    speech.appendChild(p);

    // Text-Rätsel
    if (r.type === "text") {
        const input = document.createElement("input");
        input.type = "text";
        input.id = "answer";
        input.placeholder = "Antwort hier eingeben";
        input.autocomplete = "off";
        input.autocapitalize = "none";
        speech.appendChild(input);

        setTimeout(() => input.focus(), 50);

        const okButton = document.createElement("button");
        okButton.textContent = "OK";
        okButton.onclick = checkAnswer;
        speech.appendChild(okButton);
    }

    // Multiple Choice
    else if (r.type === "multiple") {
        r.options.forEach(opt => {
            const btn = document.createElement("button");
            btn.textContent = opt;
            btn.onclick = () => checkAnswer(opt);
            speech.appendChild(btn);
        });
    }

    // Schließen-Button
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Schließen";
    closeBtn.onclick = closeDialog;
    speech.appendChild(closeBtn);

    dialog.classList.remove("hidden");
}

// =======================
// Dialog schließen
// =======================
function closeDialog() {
    dialog.classList.add("hidden");
    const input = document.getElementById("answer");
    if (input) input.value = "";
}

// =======================
// Antwort prüfen
// =======================
function checkAnswer(userInput) {
    let userAnswer;

    if (userInput !== undefined) {
        // Multiple Choice
        userAnswer = userInput.toLowerCase().trim();
    } else {
        // Text-Rätsel
        const input = document.getElementById("answer");
        if (!input) return;
        userAnswer = input.value.toLowerCase().trim()
            .replace(/ä/g, "ae")
            .replace(/ö/g, "oe")
            .replace(/ü/g, "ue")
            .replace(/ß/g, "ss");
    }

    const validSolutions = riddles[currentRiddle].solution.map(s => s.toLowerCase());

    if (validSolutions.includes(userAnswer)) {
        correctSound.play();
        solved[currentRiddle] = true;

        const obj = document.querySelector(`.object[data-id='${currentRiddle}']`);
        if (obj) obj.classList.add("solved");

        updateProgress();
        closeDialog();
    } else {
        wrongSound.play();
        alert("Leider falsch. Versuche es erneut.");
    }
}

// =======================
// Fortschritt aktualisieren
// =======================
function updateProgress() {
    const count = solved.filter(s => s).length;
    progressText.textContent = `Fortschritt: ${count} / ${riddles.length}`;

    // Endscreen nur anzeigen, wenn wirklich alle gelöst
    if (count === riddles.length && count > 0) {
        endScreen.classList.remove("hidden");
    } else {
        endScreen.classList.add("hidden");
    }
}

// Startspiel-Funktion
function startGame() {
    // Startscreen ausblenden
    startScreen.classList.add("hidden");

    // Spielfeld sichtbar machen
    document.getElementById("game-container").style.display = "block";
    document.getElementById("controls").style.display = "flex";

    // Spielfigur initial positionieren
    x = 250;
    y = 250;
    player.style.top = y + "px";
    player.style.left = x + "px";

    // Fortschritt initialisieren
    solved = new Array(riddles.length).fill(false);
    document.querySelectorAll(".object").forEach(obj => obj.classList.remove("solved"));

    updateProgress();
}

// =======================
// Spiel neustarten
// =======================
function restartGame() {
    x = 250;
    y = 250;
    player.style.top = y + "px";
    player.style.left = x + "px";

    solved = new Array(riddles.length).fill(false);
    document.querySelectorAll(".object").forEach(obj => obj.classList.remove("solved"));

    endScreen.classList.add("hidden");
    updateProgress();
    closeDialog();
}
