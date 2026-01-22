// =======================
// DOM-Elemente
// =======================
const startScreen = document.getElementById("start-screen");
const gameContainer = document.getElementById("game-container");
const controls = document.getElementById("controls");
const endScreen = document.getElementById("end-screen");
const dialog = document.getElementById("dialog");
const speech = document.querySelector(".speechbubble");
const player = document.getElementById("player");
const progressText = document.getElementById("progress");

// Sounds
const moveSound = new Audio("sounds/move.wav");
const correctSound = new Audio("sounds/correct.wav");
const wrongSound = new Audio("sounds/wrong.mp3");

// Spielfigur-Position
let x = 250;
let y = 250;

player.style.top = y + "px";
player.style.left = x + "px";

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

let solved = [];
let currentRiddle = null;

// =======================
// Alles initial ausblenden
// =======================
gameContainer.style.display = "none";
controls.style.display = "none";
dialog.classList.add("hidden");
endScreen.style.display = "none";

// =======================
// START BUTTON
// =======================
document.getElementById("start-btn").onclick = () => {
    startScreen.style.display = "none";
    gameContainer.style.display = "block";
    controls.style.display = "flex";

    // Spielfigur
    x = 250;
    y = 250;
    player.style.top = y + "px";
    player.style.left = x + "px";

    // Fortschritt initialisieren
    solved = new Array(riddles.length).fill(false);
    document.querySelectorAll(".object").forEach(obj => obj.classList.remove("solved"));
    updateProgress();
};

// =======================
// ENDSCREEN BUTTON
// =======================
document.getElementById("restart-btn").onclick = () => {
    endScreen.style.display = "none";
    startScreen.style.display = "flex";
    gameContainer.style.display = "none";
    controls.style.display = "none";
    dialog.classList.add("hidden");
};

// =======================
// Bewegung
// =======================
function move(direction){
    if (!moveSound.paused) moveSound.currentTime=0;
    moveSound.play();

    if(direction==="up" && y>0) y-=50;
    if(direction==="down" && y<450) y+=50;
    if(direction==="left" && x>0) x-=50;
    if(direction==="right" && x<450) x+=50;

    player.style.top = y+"px";
    player.style.left = x+"px";

    checkCollision();
}

document.addEventListener("keydown", e=>{
    if(e.key==="ArrowUp") move("up");
    if(e.key==="ArrowDown") move("down");
    if(e.key==="ArrowLeft") move("left");
    if(e.key==="ArrowRight") move("right");
});

window.move = move; // Touch-Buttons

// =======================
// Kollision
// =======================
function checkCollision(){
    document.querySelectorAll(".object").forEach(obj=>{
        if(obj.offsetTop===y && obj.offsetLeft===x && !solved[obj.dataset.id]){
            openDialog(obj.dataset.id);
        }
    });
}

// =======================
// Dialog
// =======================
function openDialog(id){
    if(solved[id]) return;
    currentRiddle = id;
    const r = riddles[id];
    speech.innerHTML="";

    const p = document.createElement("p");
    p.textContent = r.text;
    speech.appendChild(p);

    if(r.type==="text"){
        const input=document.createElement("input");
        input.type="text"; input.id="answer"; input.placeholder="Antwort hier eingeben";
        input.autocomplete="off"; input.autocapitalize="none";
        speech.appendChild(input);
        setTimeout(()=>input.focus(),50);

        const okBtn=document.createElement("button");
        okBtn.textContent="OK"; okBtn.onclick=checkAnswer;
        speech.appendChild(okBtn);
    } else if(r.type==="multiple"){
        r.options.forEach(opt=>{
            const btn=document.createElement("button");
            btn.textContent=opt; btn.onclick=()=>checkAnswer(opt);
            speech.appendChild(btn);
        });
    }

    const closeBtn=document.createElement("button");
    closeBtn.textContent="Schließen"; closeBtn.onclick=closeDialog;
    speech.appendChild(closeBtn);

    dialog.classList.remove("hidden");
}

function closeDialog(){ dialog.classList.add("hidden"); const input=document.getElementById("answer"); if(input) input.value=""; }

function checkAnswer(userInput){
    let userAnswer;
    if(userInput!==undefined) userAnswer=userInput.toLowerCase().trim();
    else{
        const input=document.getElementById("answer");
        if(!input) return;
        userAnswer=input.value.toLowerCase().trim().replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/ß/g,"ss");
    }

    const valid=riddles[currentRiddle].solution.map(s=>s.toLowerCase());
    if(valid.includes(userAnswer)){
        correctSound.play();
        solved[currentRiddle]=true;
        const obj=document.querySelector(`.object[data-id='${currentRiddle}']`);
        if(obj) obj.classList.add("solved");
        updateProgress(); closeDialog();
    } else { wrongSound.play(); alert("Leider falsch. Versuche es erneut."); }
}

// =======================
// Fortschritt
// =======================
function updateProgress(){
    const count=solved.filter(s=>s).length;
    progressText.textContent=`Fortschritt: ${count} / ${riddles.length}`;
    if(count===riddles.length){
        endScreen.style.display="flex";
        gameContainer.style.display="none";
        controls.style.display="none";
        dialog.classList.add("hidden");
    }
}
// =======================
// Spiel neustarten (vom Endscreen)
// =======================
function restartGame() {
    endScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");

    document.getElementById("game-container").style.display = "none";
    document.getElementById("controls").style.display = "none";
    dialog.classList.add("hidden");
}

document.getElementById("restart-btn").onclick = () => {
    // Endscreen ausblenden
    document.getElementById("end-screen").style.display = "none";

    // Startscreen wieder anzeigen
    document.getElementById("start-screen").style.display = "flex";

    // Spielfeld & Steuerung ausblenden
    document.getElementById("game-container").style.display = "none";
    document.getElementById("controls").style.display = "none";

    // Dialog schließen
    dialog.classList.add("hidden");
};

