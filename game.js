// =======================
// Variablen & DOM-Elemente
// =======================
const player = document.getElementById("player");
const dialog = document.getElementById("dialog");
const speech = document.querySelector(".speechbubble");
const progressText = document.getElementById("progress");
const endScreen = document.getElementById("end-screen");

// Fortschritt initial zurücksetzen
solved = new Array(riddles.length).fill(false);
updateProgress(); // Fortschritt einmal sauber aktualisieren


// Sounds
const moveSound = new Audio("sounds/move.wav");
const correctSound = new Audio("sounds/correct.wav");
const wrongSound = new Audio("sounds/wrong.mp3");

// Spielfigur-Position
let x = 250;
let y = 250;

// Fortschritt
let solved = [false, false, false, false];
let currentRiddle = null;

// =======================
// Rätseldefinition
// =======================
const riddles = [
    {    type: "text",
         text: "Ich werde nass, wenn ich trockne - was bin ich?", solution: ["handtuch"] },
    {    type: "text",
         text: "Buchstabensalat: RGUBMHA ", solution: ["hamburg"] },
    {
        type: "multiple",
        text: "Welche der folgenden Eigenschaften beschreibt am besten einen typischen, trockenen Riesling aus Deutschland?",
        options: ["A: Schwere, buttrige Noten mit wenig Säure", "B: Leichte, knackige Säure mit Aromen von grünen Äpfeln und Zitrusfrüchten", "C: Dunkle Beerenaromen und Tannine", "D: Süße Süßweinaromen und Rosinen"],
        solution: ["B: Leichte, knackige Säure mit Aromen von grünen Äpfeln und Zitrusfrüchten"]
    },
    {   type: "text", 
        text: "Buchstabensalat - LSENLEWS", solution: ["wellness"] }
];


// =======================
// Spielfigur bewegen
// =======================
function move(direction) {
    if (!moveSound.paused) moveSound.currentTime = 0; // Sound neu starten
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
            (obj.dataset.id);
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

    // Sprechblase leeren
    speech.innerHTML = "";

    // Rätseltext
    const p = document.createElement("p");
    p.textContent = r.text;
    speech.appendChild(p);

    // Je nach Typ: Text-Input oder Multiple Choice
   if (r.type === "text") {
    const input = document.createElement("input");
    input.type = "text";
    input.id = "answer";
    input.placeholder = "Antwort hier eingeben";
    input.autocomplete = "off";
    input.autocapitalize = "none";
    speech.appendChild(input);

    // Fokus setzen (wichtig für Smartphones)
    setTimeout(() => input.focus(), 50);

    const okButton = document.createElement("button");
    okButton.textContent = "OK";
    okButton.onclick = checkAnswer;
    speech.appendChild(okButton);
}
    } else if (r.type === "multiple") {
        r.options.forEach(opt => {
            const btn = document.createElement("button");
            btn.textContent = opt;
            btn.onclick = () => checkAnswer(opt);
            speech.appendChild(btn);
        });
    }

    // Schließen-Button immer hinzufügen
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
    // input leeren, falls vorhanden
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
        if (!input) return; // Sicherheitscheck
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

        // Objekt optisch deaktivieren
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

    // Endscreen nur anzeigen, wenn count > 0 und alle gelöst
    if (count === riddles.length && count > 0) {
        endScreen.classList.remove("hidden");
    } else {
        endScreen.classList.add("hidden");
    }
}


// =======================
// Spiel neustarten
// =======================
function restartGame() {
    x = 250;
    y = 250;
    player.style.top = y + "px";
    player.style.left = x + "px";

    // Fortschritt zurücksetzen
    solved = new Array(riddles.length).fill(false);

    // Objekte wieder aktiv
    document.querySelectorAll(".object").forEach(obj => obj.classList.remove("solved"));

    // Endscreen ausblenden
    endScreen.classList.add("hidden");

    updateProgress();
    closeDialog();
}


    updateProgress();
    closeDialog();
}
